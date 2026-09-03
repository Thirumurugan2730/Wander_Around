package com.dailywander.service;

import net.coobird.thumbnailator.Thumbnails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDate;
import java.util.Iterator;
import java.util.UUID;

@Service
public class ImageService {

    private static final Logger logger = LoggerFactory.getLogger(ImageService.class);
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
    private static final int MAX_WIDTH = 1600;
    private static final long TARGET_MAX_SIZE_BYTES = 1024 * 1024; // ~1 MB

    private final String supabaseUrl;
    private final String serviceRoleKey;
    private final String bucketName;
    private final HttpClient httpClient;

    public ImageService(
            @Value("${supabase.url:}") String supabaseUrl,
            @Value("${supabase.service-role-key:}") String serviceRoleKey,
            @Value("${supabase.bucket:moments}") String bucketName) {
        this.supabaseUrl = supabaseUrl != null ? supabaseUrl.replaceAll("/+$", "") : "";
        this.serviceRoleKey = serviceRoleKey;
        this.bucketName = bucketName;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();
    }

    public String processAndUpload(MultipartFile file, LocalDate postDate) {
        validateFile(file);

        byte[] originalBytes;
        try {
            originalBytes = file.getBytes();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to read image content");
        }

        validateImageFormat(originalBytes, file.getContentType());

        BufferedImage originalImage;
        try {
            originalImage = ImageIO.read(new ByteArrayInputStream(originalBytes));
            if (originalImage == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Uploaded file is not a valid decodable image");
            }
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to decode image");
        }

        BufferedImage processedImage;
        try {
            if (originalImage.getWidth() > MAX_WIDTH) {
                logger.info("Resizing image proportionally from width {} to {}", originalImage.getWidth(), MAX_WIDTH);
                processedImage = Thumbnails.of(originalImage)
                        .width(MAX_WIDTH)
                        .asBufferedImage();
            } else {
                processedImage = originalImage;
            }
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to resize image");
        }

        byte[] webpBytes = convertAndCompressToWebp(processedImage);
        logger.info("Image successfully processed to WebP: size={} bytes (~{} KB)",
                webpBytes.length, webpBytes.length / 1024);

        String storagePath = postDate.toString() + "/" + UUID.randomUUID() + ".webp";

        uploadToStorage(webpBytes, storagePath);
        return storagePath;
    }

    public void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image file is required");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Original image exceeds maximum allowed size of 50 MB");
        }
    }

    public void validateImageFormat(byte[] bytes, String declaredContentType) {
        if (bytes.length < 12) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid image data");
        }

        boolean isJpeg = (bytes[0] == (byte) 0xFF && bytes[1] == (byte) 0xD8 && bytes[2] == (byte) 0xFF);
        boolean isPng = (bytes[0] == (byte) 0x89 && bytes[1] == (byte) 0x50 &&
                         bytes[2] == (byte) 0x4E && bytes[3] == (byte) 0x47);
        boolean isWebp = (bytes[0] == (byte) 'R' && bytes[1] == (byte) 'I' &&
                          bytes[2] == (byte) 'F' && bytes[3] == (byte) 'F' &&
                          bytes[8] == (byte) 'W' && bytes[9] == (byte) 'E' &&
                          bytes[10] == (byte) 'B' && bytes[11] == (byte) 'P');

        if (!isJpeg && !isPng && !isWebp) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Unsupported image format. Allowed formats: JPEG, PNG, WebP.");
        }
    }

    public byte[] convertAndCompressToWebp(BufferedImage image) {
        float[] qualitySteps = {0.85f, 0.75f, 0.65f, 0.55f, 0.45f, 0.35f};
        byte[] bestBytes = null;

        for (float quality : qualitySteps) {
            try {
                byte[] encoded = encodeWebp(image, quality);
                bestBytes = encoded;
                if (encoded.length <= TARGET_MAX_SIZE_BYTES) {
                    logger.debug("WebP compressed to {} bytes with quality {}", encoded.length, quality);
                    break;
                }
            } catch (IOException e) {
                logger.error("Error during WebP encoding at quality {}: {}", quality, e.getMessage());
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to encode image to WebP");
            }
        }

        if (bestBytes == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to encode image to WebP");
        }
        return bestBytes;
    }

    private byte[] encodeWebp(BufferedImage image, float quality) throws IOException {
        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("webp");
        if (!writers.hasNext()) {
            throw new IllegalStateException("No WebP ImageWriter registered in ImageIO");
        }
        ImageWriter writer = writers.next();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ImageOutputStream ios = ImageIO.createImageOutputStream(baos)) {
            writer.setOutput(ios);
            ImageWriteParam param = writer.getDefaultWriteParam();
            if (param.canWriteCompressed()) {
                param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                if (param.getCompressionTypes() != null && param.getCompressionTypes().length > 0) {
                    param.setCompressionType(param.getCompressionTypes()[0]);
                }
                param.setCompressionQuality(quality);
            }
            writer.write(null, new IIOImage(image, null, null), param);
        } finally {
            writer.dispose();
        }
        return baos.toByteArray();
    }

    public void uploadToStorage(byte[] webpBytes, String storagePath) {
        if (supabaseUrl == null || supabaseUrl.isBlank() || serviceRoleKey == null || serviceRoleKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Supabase Storage configuration missing (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
        }

        ensureBucketExists();

        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + storagePath;
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(uploadUrl))
                    .header("Authorization", "Bearer " + serviceRoleKey)
                    .header("apiKey", serviceRoleKey)
                    .header("Content-Type", "image/webp")
                    .POST(HttpRequest.BodyPublishers.ofByteArray(webpBytes))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                logger.error("Supabase Storage upload failed with status {}: {}", response.statusCode(), response.body());
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "The image could not be uploaded right now. Please try again.");
            }
            logger.info("Successfully uploaded object to Supabase Storage: {}/{}", bucketName, storagePath);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "The image could not be uploaded right now. Please try again.");
        } catch (IOException e) {
            logger.error("Storage upload network error: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "The image could not be uploaded right now. Please try again.");
        }
    }

    public boolean deleteStorageObject(String storagePath) {
        if (supabaseUrl == null || supabaseUrl.isBlank() || serviceRoleKey == null || serviceRoleKey.isBlank()) {
            logger.warn("Cannot delete storage object {}: Supabase configuration missing", storagePath);
            return false;
        }
        String deleteUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + storagePath;
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(deleteUrl))
                    .header("Authorization", "Bearer " + serviceRoleKey)
                    .header("apiKey", serviceRoleKey)
                    .DELETE()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            int code = response.statusCode();
            if (code >= 200 && code < 300) {
                logger.info("Successfully deleted Storage object: {}/{}", bucketName, storagePath);
                return true;
            } else if (code == 404) {
                logger.info("Storage object already absent (404): {}/{}", bucketName, storagePath);
                return true;
            } else {
                logger.error("Failed to delete storage object {}/{} (HTTP {}): {}",
                        bucketName, storagePath, code, response.body());
                return false;
            }
        } catch (Exception e) {
            logger.error("Failed to delete storage object {} due to exception: {}", storagePath, e.getMessage());
            return false;
        }
    }

    public void ensureBucketExists() {
        String bucketUrl = supabaseUrl + "/storage/v1/bucket/" + bucketName;
        try {
            HttpRequest getRequest = HttpRequest.newBuilder()
                    .uri(URI.create(bucketUrl))
                    .header("Authorization", "Bearer " + serviceRoleKey)
                    .header("apiKey", serviceRoleKey)
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(getRequest, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                return;
            }

            if (response.statusCode() == 404) {
                logger.info("Bucket '{}' does not exist. Attempting to create it...", bucketName);
                String createBucketUrl = supabaseUrl + "/storage/v1/bucket";
                String body = "{\"id\":\"" + bucketName + "\",\"name\":\"" + bucketName + "\",\"public\":true}";
                HttpRequest postRequest = HttpRequest.newBuilder()
                        .uri(URI.create(createBucketUrl))
                        .header("Authorization", "Bearer " + serviceRoleKey)
                        .header("apiKey", serviceRoleKey)
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(body))
                        .build();
                HttpResponse<String> createResponse = httpClient.send(postRequest, HttpResponse.BodyHandlers.ofString());
                if (createResponse.statusCode() >= 200 && createResponse.statusCode() < 300) {
                    logger.info("Successfully created Supabase Storage bucket '{}'", bucketName);
                } else {
                    logger.warn("Could not automatically create bucket '{}' (HTTP {}): {}. Please ensure it is created in Supabase Dashboard.",
                            bucketName, createResponse.statusCode(), createResponse.body());
                }
            }
        } catch (Exception e) {
            logger.warn("Error checking bucket status: {}", e.getMessage());
        }
    }
}
