package com.dailywander.controller;

import com.dailywander.entity.Post;
import com.dailywander.repository.PostRepository;
import com.dailywander.service.CleanupService;
import com.dailywander.service.PostService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostControllerTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private PostService postService;

    @Mock
    private CleanupService cleanupService;

    private PostController postController;
    private final String testToken = "test-secret-token";

    @BeforeEach
    void setUp() {
        postController = new PostController(postRepository, postService, cleanupService, testToken);
    }

    @Test
    void getTodayPosts_noStalePosts_returnsPostsWithoutTriggeringCleanup() {
        LocalDate todayKolkata = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        Post mockPost = new Post(1L, "Thiru", "Testing Daily Wander backend", null, false, OffsetDateTime.now(), todayKolkata);

        when(postRepository.existsByPostDateLessThan(todayKolkata)).thenReturn(false);
        when(postRepository.findByPostDate(todayKolkata)).thenReturn(List.of(mockPost));

        ResponseEntity<List<Post>> response = postController.getTodayPosts();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("Thiru", response.getBody().get(0).getUsername());
        verify(cleanupService, never()).cleanupStalePosts();
        verify(postRepository, times(1)).findByPostDate(todayKolkata);
    }

    @Test
    void getTodayPosts_stalePostsExist_triggersCleanupFirst() {
        LocalDate todayKolkata = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        Post mockPost = new Post(1L, "Thiru", "Testing Daily Wander backend", null, false, OffsetDateTime.now(), todayKolkata);

        when(postRepository.existsByPostDateLessThan(todayKolkata)).thenReturn(true);
        when(postRepository.findByPostDate(todayKolkata)).thenReturn(List.of(mockPost));

        ResponseEntity<List<Post>> response = postController.getTodayPosts();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(cleanupService, times(1)).cleanupStalePosts();
        verify(postRepository, times(1)).findByPostDate(todayKolkata);
    }

    @Test
    void getTodayCount_returnsCountData() {
        LocalDate todayKolkata = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        Map<String, Object> countData = Map.of(
                "photosToday", 2L,
                "photoLimit", 100,
                "photosRemaining", 98L,
                "textOnlyAllowed", true
        );

        when(postService.getDailyPhotoCount(todayKolkata)).thenReturn(countData);

        ResponseEntity<Map<String, Object>> response = postController.getTodayCount();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2L, response.getBody().get("photosToday"));
        assertEquals(100, response.getBody().get("photoLimit"));
        assertEquals(98L, response.getBody().get("photosRemaining"));
        assertEquals(true, response.getBody().get("textOnlyAllowed"));
    }

    @Test
    void createPost_delegatesToPostService() {
        LocalDate todayKolkata = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        MockMultipartFile mockFile = new MockMultipartFile("photo", "test.jpg", "image/jpeg", new byte[]{1, 2, 3});
        Post mockPost = new Post(10L, "Thiru", "Testing upload", "path.webp", true, OffsetDateTime.now(), todayKolkata);

        when(postService.createPost(eq(mockFile), eq("Thiru"), eq("Testing upload"), eq(todayKolkata)))
                .thenReturn(mockPost);

        ResponseEntity<Post> response = postController.createPost(mockFile, null, "Thiru", "Testing upload");

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(10L, response.getBody().getId());
        assertEquals("path.webp", response.getBody().getImagePath());
        assertEquals(true, response.getBody().getHasPhoto());
    }

    @Test
    void deletePost_missingAdminToken_throwsUnauthorized() {
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                postController.deletePost(1L, null));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
        assertEquals("Admin authentication is required.", ex.getReason());
        verifyNoInteractions(postService);
    }

    @Test
    void deletePost_wrongAdminToken_throwsForbidden() {
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                postController.deletePost(1L, "wrong-token"));

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        assertEquals("You are not authorized to perform this action.", ex.getReason());
        verifyNoInteractions(postService);
    }

    @Test
    void deletePost_correctAdminToken_deletesAndReturnsOk() {
        doNothing().when(postService).deletePost(1L);

        ResponseEntity<Map<String, String>> response = postController.deletePost(1L, testToken);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Post deleted successfully.", response.getBody().get("message"));
        verify(postService, times(1)).deletePost(1L);
    }
}
