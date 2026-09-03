package com.dailywander.service;

import com.dailywander.entity.Post;
import com.dailywander.repository.PostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class PostService {

    private static final Logger logger = LoggerFactory.getLogger(PostService.class);
    private static final int MAX_TEXT_LENGTH = 500;
    private static final int MAX_USERNAME_LENGTH = 30;
    private static final String DEFAULT_USERNAME = "Anonymous";

    private final PostRepository postRepository;
    private final ImageService imageService;
    private final JdbcTemplate jdbcTemplate;
    private final int photoLimit;

    public PostService(
            PostRepository postRepository,
            ImageService imageService,
            JdbcTemplate jdbcTemplate,
            @Value("${daily-wander.photo-limit:100}") int photoLimit) {
        this.postRepository = postRepository;
        this.imageService = imageService;
        this.jdbcTemplate = jdbcTemplate;
        this.photoLimit = photoLimit;
    }

    public Post createPost(MultipartFile photo, String username, String text, LocalDate today) {
        // Normalize text
        String trimmedText = (text != null && !text.isBlank()) ? text.trim() : null;
        if (trimmedText != null && trimmedText.length() > MAX_TEXT_LENGTH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Text cannot exceed 500 characters.");
        }

        // Normalize username (default to Anonymous if omitted or blank)
        String normalizedUsername;
        if (username != null && !username.isBlank()) {
            normalizedUsername = username.trim();
            if (normalizedUsername.length() > MAX_USERNAME_LENGTH) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username cannot exceed 30 characters.");
            }
        } else {
            normalizedUsername = DEFAULT_USERNAME;
        }

        boolean hasPhoto = (photo != null && !photo.isEmpty());

        // Empty post validation: reject if both photo and text are empty
        if (!hasPhoto && trimmedText == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please provide a photo or text.");
        }

        // Text-only post: always allowed, no quota enforcement
        if (!hasPhoto) {
            Post post = new Post();
            post.setUsername(normalizedUsername);
            post.setText(trimmedText);
            post.setImagePath(null);
            post.setHasPhoto(false);
            post.setCreatedAt(OffsetDateTime.now());
            post.setPostDate(today);

            Post saved = postRepository.save(post);
            logger.info("Created text-only post id={} for date {}", saved.getId(), today);
            return saved;
        }

        // Photo post:
        // 1. Fast pre-check to reject early before image processing/upload if already at limit
        long currentCount = postRepository.countByPostDateAndHasPhotoTrue(today);
        if (currentCount >= photoLimit) {
            logger.warn("Daily photo quota exceeded (pre-check): {} >= limit {}", currentCount, photoLimit);
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Today's photo limit has been reached. You can still share a text-only moment.");
        }

        // 2. Process image and upload to Supabase Storage
        String storagePath = imageService.processAndUpload(photo, today);

        // 3. Atomically lock, re-verify quota, and save post in PostgreSQL
        try {
            return savePhotoPostWithLock(normalizedUsername, trimmedText, storagePath, today);
        } catch (Exception e) {
            logger.warn("Rolling back uploaded storage object {} due to failure: {}", storagePath, e.getMessage());
            imageService.deleteStorageObject(storagePath);
            if (e instanceof ResponseStatusException rse) {
                throw rse;
            }
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to persist post to database");
        }
    }

    @Transactional
    public Post savePhotoPostWithLock(String username, String text, String storagePath, LocalDate today) {
        // Acquire PostgreSQL transaction-scoped advisory lock for today's date
        // Ensures concurrent photo upload requests are strictly serialized during quota check and insert
        long lockKey = 0x57414E4400000000L | (today.toEpochDay() & 0xFFFFFFFFL);
        jdbcTemplate.execute("SELECT pg_advisory_xact_lock(" + lockKey + ")");

        long count = postRepository.countByPostDateAndHasPhotoTrue(today);
        if (count >= photoLimit) {
            logger.warn("Daily photo quota reached under transaction lock: {} >= limit {}", count, photoLimit);
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Today's photo limit has been reached. You can still share a text-only moment.");
        }

        Post post = new Post();
        post.setUsername(username);
        post.setText(text);
        post.setImagePath(storagePath);
        post.setHasPhoto(true);
        post.setCreatedAt(OffsetDateTime.now());
        post.setPostDate(today);

        Post saved = postRepository.save(post);
        logger.info("Saved photo post id={} with imagePath={} (photos today: {})", saved.getId(), storagePath, count + 1);
        return saved;
    }

    public Map<String, Object> getDailyPhotoCount(LocalDate today) {
        long photosToday = postRepository.countByPostDateAndHasPhotoTrue(today);
        long photosRemaining = Math.max(0, photoLimit - photosToday);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("photosToday", photosToday);
        response.put("photoLimit", photoLimit);
        response.put("photosRemaining", photosRemaining);
        response.put("textOnlyAllowed", true);
        return response;
    }

    public void deletePost(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found."));

        if (Boolean.TRUE.equals(post.getHasPhoto()) && post.getImagePath() != null) {
            String imagePath = post.getImagePath();
            logger.info("Admin deleting photo post id={}, removing storage object: {}", id, imagePath);
            boolean deleteSucceeded = imageService.deleteStorageObject(imagePath);
            if (!deleteSucceeded) {
                logger.error("Failed to delete storage object {} for post id={}. Deletion aborted to preserve consistency.",
                        imagePath, id);
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "The image could not be removed from storage. The post was not deleted.");
            }
        } else {
            logger.info("Admin deleting text-only post id={}", id);
        }

        postRepository.delete(post);
        logger.info("Successfully deleted post id={}", id);
    }

    public int getPhotoLimit() {
        return photoLimit;
    }
}
