package com.dailywander.service;

import com.dailywander.entity.Post;
import com.dailywander.repository.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private ImageService imageService;

    @Mock
    private JdbcTemplate jdbcTemplate;

    private PostService postService;
    private final LocalDate today = LocalDate.of(2026, 9, 3);

    @BeforeEach
    void setUp() {
        postService = new PostService(postRepository, imageService, jdbcTemplate, 100);
    }

    @Test
    void createPost_emptyPost_throwsBadRequest() {
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                postService.createPost(null, "Thiru", "   ", today));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        assertEquals("Please provide a photo or text.", ex.getReason());
    }

    @Test
    void createPost_textTooLong_throwsBadRequest() {
        String longText = "a".repeat(501);
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                postService.createPost(null, "Thiru", longText, today));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        assertEquals("Text cannot exceed 500 characters.", ex.getReason());
    }

    @Test
    void createPost_usernameTooLong_throwsBadRequest() {
        String longUsername = "a".repeat(31);
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                postService.createPost(null, longUsername, "Hello", today));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        assertEquals("Username cannot exceed 30 characters.", ex.getReason());
    }

    @Test
    void createPost_textOnly_defaultsToAnonymousAndDoesNotCount() {
        when(postRepository.save(any(Post.class))).thenAnswer(i -> {
            Post p = i.getArgument(0);
            p.setId(1L);
            return p;
        });

        Post post = postService.createPost(null, null, "Hello World", today);

        assertEquals(1L, post.getId());
        assertEquals("Anonymous", post.getUsername());
        assertEquals("Hello World", post.getText());
        assertNull(post.getImagePath());
        assertFalse(post.getHasPhoto());
        verifyNoInteractions(imageService);
    }

    @Test
    void createPost_photoPost_quotaExceededPreCheck_throwsConflict() {
        PostService limitedService = new PostService(postRepository, imageService, jdbcTemplate, 2);
        when(postRepository.countByPostDateAndHasPhotoTrue(today)).thenReturn(2L);

        MockMultipartFile file = new MockMultipartFile("photo", "test.jpg", "image/jpeg", new byte[]{1, 2});

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                limitedService.createPost(file, "Thiru", "Photo post", today));

        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        assertEquals("Today's photo limit has been reached. You can still share a text-only moment.", ex.getReason());
        verifyNoInteractions(imageService);
    }

    @Test
    void createPost_photoPost_success() {
        MockMultipartFile file = new MockMultipartFile("photo", "test.jpg", "image/jpeg", new byte[]{1, 2});
        when(postRepository.countByPostDateAndHasPhotoTrue(today)).thenReturn(0L);
        when(imageService.processAndUpload(file, today)).thenReturn("2026-09-03/uuid.webp");
        when(postRepository.save(any(Post.class))).thenAnswer(i -> {
            Post p = i.getArgument(0);
            p.setId(5L);
            return p;
        });

        Post post = postService.createPost(file, "Thiru", "Photo post", today);

        assertEquals(5L, post.getId());
        assertTrue(post.getHasPhoto());
        assertEquals("2026-09-03/uuid.webp", post.getImagePath());
        verify(jdbcTemplate, times(1)).execute(anyString());
    }

    @Test
    void getDailyPhotoCount_calculatesCorrectly() {
        when(postRepository.countByPostDateAndHasPhotoTrue(today)).thenReturn(37L);

        Map<String, Object> count = postService.getDailyPhotoCount(today);

        assertEquals(37L, count.get("photosToday"));
        assertEquals(100, count.get("photoLimit"));
        assertEquals(63L, count.get("photosRemaining"));
        assertEquals(true, count.get("textOnlyAllowed"));
    }

    @Test
    void deletePost_notFound_throwsNotFound() {
        when(postRepository.findById(999L)).thenReturn(java.util.Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                postService.deletePost(999L));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        assertEquals("Post not found.", ex.getReason());
        verify(postRepository, never()).delete(any());
    }

    @Test
    void deletePost_photoPost_success() {
        Post post = new Post(1L, "User", "Text", "2026-09-03/img.webp", true, null, today);
        when(postRepository.findById(1L)).thenReturn(java.util.Optional.of(post));
        when(imageService.deleteStorageObject("2026-09-03/img.webp")).thenReturn(true);

        postService.deletePost(1L);

        verify(imageService, times(1)).deleteStorageObject("2026-09-03/img.webp");
        verify(postRepository, times(1)).delete(post);
    }

    @Test
    void deletePost_photoPost_storageDeleteFails_throwsBadGatewayAndRetainsPost() {
        Post post = new Post(2L, "User", "Text", "2026-09-03/fail.webp", true, null, today);
        when(postRepository.findById(2L)).thenReturn(java.util.Optional.of(post));
        when(imageService.deleteStorageObject("2026-09-03/fail.webp")).thenReturn(false);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                postService.deletePost(2L));

        assertEquals(HttpStatus.BAD_GATEWAY, ex.getStatusCode());
        assertEquals("The image could not be removed from storage. The post was not deleted.", ex.getReason());
        verify(postRepository, never()).delete(any());
    }

    @Test
    void deletePost_textPost_success() {
        Post post = new Post(3L, "User", "Text", null, false, null, today);
        when(postRepository.findById(3L)).thenReturn(java.util.Optional.of(post));

        postService.deletePost(3L);

        verifyNoInteractions(imageService);
        verify(postRepository, times(1)).delete(post);
    }
}

