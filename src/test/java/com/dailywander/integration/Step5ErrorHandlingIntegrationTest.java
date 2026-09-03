package com.dailywander.integration;

import com.dailywander.entity.Post;
import com.dailywander.exception.GlobalExceptionHandler;
import com.dailywander.repository.PostRepository;
import com.dailywander.service.ImageService;
import com.dailywander.service.PostService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class Step5ErrorHandlingIntegrationTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private ImageService imageService;

    @Mock
    private PostService postService;

    @Mock
    private com.dailywander.service.CleanupService cleanupService;

    private MockMvc mockMvc;
    private final String adminToken = "secret-admin-token";

    @BeforeEach
    void setUp() {
        com.dailywander.controller.PostController postController =
                new com.dailywander.controller.PostController(postRepository, postService, cleanupService, adminToken);

        mockMvc = MockMvcBuilders.standaloneSetup(postController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void storageUploadFailure_returns502BadGateway() throws Exception {
        MockMultipartFile file = new MockMultipartFile("photo", "test.jpg", "image/jpeg", new byte[]{1, 2, 3});

        when(postService.createPost(any(), eq("Thiru"), eq("Upload test"), any(LocalDate.class)))
                .thenThrow(new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "The image could not be uploaded right now. Please try again."));

        mockMvc.perform(multipart("/api/posts")
                        .file(file)
                        .param("username", "Thiru")
                        .param("text", "Upload test"))
                .andExpect(status().isBadGateway())
                .andExpect(jsonPath("$.message").value("The image could not be uploaded right now. Please try again."));
    }

    @Test
    void storageDeleteFailure_returns502BadGateway() throws Exception {
        doThrow(new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                "The image could not be removed from storage. The post was not deleted."))
                .when(postService).deletePost(10L);

        mockMvc.perform(delete("/api/posts/10")
                        .header("X-Admin-Token", adminToken))
                .andExpect(status().isBadGateway())
                .andExpect(jsonPath("$.message").value("The image could not be removed from storage. The post was not deleted."));
    }

    @Test
    void genericUnexpectedException_returns500WithoutStackTrace() throws Exception {
        when(postService.createPost(any(), any(), any(), any(LocalDate.class)))
                .thenThrow(new RuntimeException("Database timeout connection error password=secret"));

        MockMultipartFile file = new MockMultipartFile("photo", "test.jpg", "image/jpeg", new byte[]{1, 2, 3});

        mockMvc.perform(multipart("/api/posts")
                        .file(file)
                        .param("username", "Thiru")
                        .param("text", "Generic error test"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Something went wrong. Please try again later."));
    }
}
