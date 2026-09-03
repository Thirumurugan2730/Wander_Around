package com.dailywander.controller;

import com.dailywander.entity.Post;
import com.dailywander.repository.PostRepository;
import com.dailywander.service.PostService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);
    private static final ZoneId KOLKATA_ZONE = ZoneId.of("Asia/Kolkata");

    private final PostRepository postRepository;
    private final PostService postService;
    private final com.dailywander.service.CleanupService cleanupService;
    private final String expectedAdminToken;

    public PostController(
            PostRepository postRepository,
            PostService postService,
            com.dailywander.service.CleanupService cleanupService,
            @Value("${daily-wander.admin-token:}") String expectedAdminToken) {
        this.postRepository = postRepository;
        this.postService = postService;
        this.cleanupService = cleanupService;
        this.expectedAdminToken = expectedAdminToken;
    }

    @GetMapping("/today")
    public ResponseEntity<List<Post>> getTodayPosts() {
        LocalDate today = LocalDate.now(KOLKATA_ZONE);
        if (postRepository.existsByPostDateLessThan(today)) {
            logger.info("Stale posts detected before {}. Triggering lazy cleanup fallback...", today);
            cleanupService.cleanupStalePosts();
        }

        logger.info("Fetching posts for today ({}) in timezone Asia/Kolkata", today);
        List<Post> posts = postRepository.findByPostDate(today);
        logger.info("Retrieved {} posts for date {}", posts.size(), today);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/today/count")
    public ResponseEntity<Map<String, Object>> getTodayCount() {
        LocalDate today = LocalDate.now(KOLKATA_ZONE);
        Map<String, Object> countData = postService.getDailyPhotoCount(today);
        return ResponseEntity.ok(countData);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Post> createPost(
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "text", required = false) String text) {

        MultipartFile actualPhoto = (photo != null && !photo.isEmpty()) ? photo : image;
        LocalDate today = LocalDate.now(KOLKATA_ZONE);

        Post savedPost = postService.createPost(actualPhoto, username, text, today);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePost(
            @PathVariable("id") Long id,
            @RequestHeader(value = "X-Admin-Token", required = false) String adminTokenHeader) {

        if (adminTokenHeader == null || adminTokenHeader.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Admin authentication is required.");
        }

        if (expectedAdminToken == null || expectedAdminToken.isBlank()
                || !MessageDigest.isEqual(
                        expectedAdminToken.getBytes(StandardCharsets.UTF_8),
                        adminTokenHeader.getBytes(StandardCharsets.UTF_8))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to perform this action.");
        }

        postService.deletePost(id);
        return ResponseEntity.ok(Map.of("message", "Post deleted successfully."));
    }
}
