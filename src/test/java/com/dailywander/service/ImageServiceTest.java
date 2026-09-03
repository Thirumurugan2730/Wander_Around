package com.dailywander.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

import static org.junit.jupiter.api.Assertions.*;

class ImageServiceTest {

    private ImageService imageService;

    @BeforeEach
    void setUp() {
        imageService = new ImageService("http://localhost:9999", "dummy-key", "moments");
    }

    @Test
    void validateFile_nullOrEmptyFile_throwsBadRequest() {
        assertThrows(ResponseStatusException.class, () -> imageService.validateFile(null));
        assertThrows(ResponseStatusException.class, () ->
                imageService.validateFile(new MockMultipartFile("image", new byte[0])));
    }

    @Test
    void validateFile_exceeds50Mb_throwsBadRequest() {
        MockMultipartFile largeFile = new MockMultipartFile("image", "large.jpg", "image/jpeg", new byte[10]) {
            @Override
            public long getSize() {
                return 51L * 1024 * 1024;
            }
        };
        assertThrows(ResponseStatusException.class, () -> imageService.validateFile(largeFile));
    }

    @Test
    void validateImageFormat_validFormats_pass() {
        // JPEG magic bytes
        byte[] jpegHeader = new byte[]{(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, 0, 0, 0, 0, 0, 0, 0, 0, 0};
        assertDoesNotThrow(() -> imageService.validateImageFormat(jpegHeader, "image/jpeg"));

        // PNG magic bytes
        byte[] pngHeader = new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 0};
        assertDoesNotThrow(() -> imageService.validateImageFormat(pngHeader, "image/png"));

        // WebP magic bytes: RIFF....WEBP
        byte[] webpHeader = new byte[]{'R', 'I', 'F', 'F', 0, 0, 0, 0, 'W', 'E', 'B', 'P'};
        assertDoesNotThrow(() -> imageService.validateImageFormat(webpHeader, "image/webp"));
    }

    @Test
    void validateImageFormat_invalidFormats_throwBadRequest() {
        // PDF (%PDF)
        byte[] pdfHeader = new byte[]{'%', 'P', 'D', 'F', '-', '1', '.', '5', 0, 0, 0, 0};
        assertThrows(ResponseStatusException.class, () -> imageService.validateImageFormat(pdfHeader, "application/pdf"));

        // GIF (GIF89a)
        byte[] gifHeader = new byte[]{'G', 'I', 'F', '8', '9', 'a', 0, 0, 0, 0, 0, 0};
        assertThrows(ResponseStatusException.class, () -> imageService.validateImageFormat(gifHeader, "image/gif"));

        // SVG (<svg)
        byte[] svgHeader = new byte[]{'<', 's', 'v', 'g', ' ', 'w', 'i', 'd', 't', 'h', '=', '"'};
        assertThrows(ResponseStatusException.class, () -> imageService.validateImageFormat(svgHeader, "image/svg+xml"));
    }

    @Test
    void convertAndCompressToWebp_convertsSuccessfully() throws Exception {
        BufferedImage img = new BufferedImage(800, 600, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = img.createGraphics();
        g.setColor(Color.BLUE);
        g.fillRect(0, 0, 800, 600);
        g.dispose();

        byte[] webpBytes = imageService.convertAndCompressToWebp(img);
        assertNotNull(webpBytes);
        assertTrue(webpBytes.length > 0);
        assertTrue(webpBytes.length <= 1024 * 1024, "Image must be <= 1MB");
        assertEquals('R', (char) webpBytes[0]);
        assertEquals('I', (char) webpBytes[1]);
        assertEquals('F', (char) webpBytes[2]);
        assertEquals('F', (char) webpBytes[3]);
        assertEquals('W', (char) webpBytes[8]);
        assertEquals('E', (char) webpBytes[9]);
        assertEquals('B', (char) webpBytes[10]);
        assertEquals('P', (char) webpBytes[11]);
    }
}
