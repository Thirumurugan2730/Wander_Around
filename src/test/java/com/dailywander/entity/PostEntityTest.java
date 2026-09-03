package com.dailywander.entity;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.OffsetDateTime;

import static org.junit.jupiter.api.Assertions.*;

class PostEntityTest {

    @Test
    void testPostProperties() {
        Post post = new Post();
        post.setId(1L);
        post.setUsername("Thiru");
        post.setText("Testing Daily Wander backend");
        post.setImagePath(null);
        post.setHasPhoto(false);
        OffsetDateTime now = OffsetDateTime.now();
        post.setCreatedAt(now);
        LocalDate today = LocalDate.now();
        post.setPostDate(today);

        assertEquals(1L, post.getId());
        assertEquals("Thiru", post.getUsername());
        assertEquals("Testing Daily Wander backend", post.getText());
        assertNull(post.getImagePath());
        assertFalse(post.getHasPhoto());
        assertEquals(now, post.getCreatedAt());
        assertEquals(today, post.getPostDate());
    }
}
