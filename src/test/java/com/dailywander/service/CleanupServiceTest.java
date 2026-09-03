package com.dailywander.service;

import com.dailywander.entity.Post;
import com.dailywander.repository.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CleanupServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private ImageService imageService;

    private CleanupService cleanupService;

    @BeforeEach
    void setUp() {
        cleanupService = new CleanupService(postRepository, imageService);
    }

    @Test
    void cleanupStalePosts_noStalePosts_returnsZero() {
        when(postRepository.findByPostDateLessThan(any(LocalDate.class))).thenReturn(Collections.emptyList());

        CleanupService.CleanupReport report = cleanupService.cleanupStalePosts();

        assertEquals(0, report.postsFound());
        assertEquals(0, report.postsDeleted());
        assertEquals(0, report.storageObjectsDeleted());
        assertEquals(0, report.storageDeletionsFailed());
        verifyNoInteractions(imageService);
    }

    @Test
    void cleanupStalePosts_stalePhotoPost_successfulStorageDelete_deletesPost() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        Post photoPost = new Post(1L, "User", "Photo text", "2026-09-02/uuid.webp", true, OffsetDateTime.now(), yesterday);

        when(postRepository.findByPostDateLessThan(any(LocalDate.class))).thenReturn(List.of(photoPost));
        when(imageService.deleteStorageObject("2026-09-02/uuid.webp")).thenReturn(true);

        CleanupService.CleanupReport report = cleanupService.cleanupStalePosts();

        assertEquals(1, report.postsFound());
        assertEquals(1, report.postsDeleted());
        assertEquals(1, report.storageObjectsDeleted());
        assertEquals(0, report.storageDeletionsFailed());

        verify(imageService, times(1)).deleteStorageObject("2026-09-02/uuid.webp");
        verify(postRepository, times(1)).delete(photoPost);
    }

    @Test
    void cleanupStalePosts_stalePhotoPost_storageDeleteFails_retainsPost() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        Post photoPost = new Post(2L, "User", "Photo text", "2026-09-02/failed.webp", true, OffsetDateTime.now(), yesterday);

        when(postRepository.findByPostDateLessThan(any(LocalDate.class))).thenReturn(List.of(photoPost));
        when(imageService.deleteStorageObject("2026-09-02/failed.webp")).thenReturn(false);

        CleanupService.CleanupReport report = cleanupService.cleanupStalePosts();

        assertEquals(1, report.postsFound());
        assertEquals(0, report.postsDeleted());
        assertEquals(0, report.storageObjectsDeleted());
        assertEquals(1, report.storageDeletionsFailed());

        verify(imageService, times(1)).deleteStorageObject("2026-09-02/failed.webp");
        verify(postRepository, never()).delete(photoPost);
    }

    @Test
    void cleanupStalePosts_staleTextOnlyPost_deletesWithoutStorageCall() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        Post textPost = new Post(3L, "User", "Text only", null, false, OffsetDateTime.now(), yesterday);

        when(postRepository.findByPostDateLessThan(any(LocalDate.class))).thenReturn(List.of(textPost));

        CleanupService.CleanupReport report = cleanupService.cleanupStalePosts();

        assertEquals(1, report.postsFound());
        assertEquals(1, report.postsDeleted());
        assertEquals(0, report.storageObjectsDeleted());
        assertEquals(0, report.storageDeletionsFailed());

        verifyNoInteractions(imageService);
        verify(postRepository, times(1)).delete(textPost);
    }
}
