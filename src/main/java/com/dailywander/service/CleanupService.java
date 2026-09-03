package com.dailywander.service;

import com.dailywander.entity.Post;
import com.dailywander.repository.PostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class CleanupService {

    private static final Logger logger = LoggerFactory.getLogger(CleanupService.class);
    private static final ZoneId KOLKATA_ZONE = ZoneId.of("Asia/Kolkata");

    private final PostRepository postRepository;
    private final ImageService imageService;
    private final AtomicBoolean isCleaning = new AtomicBoolean(false);

    public CleanupService(PostRepository postRepository, ImageService imageService) {
        this.postRepository = postRepository;
        this.imageService = imageService;
    }

    public record CleanupReport(
            int postsFound,
            int postsDeleted,
            int storageObjectsDeleted,
            int storageDeletionsFailed
    ) {}

    @Scheduled(cron = "${daily-wander.cleanup.cron:0 5 0 * * *}", zone = "${daily-wander.cleanup.zone:Asia/Kolkata}")
    public void scheduledCleanup() {
        logger.info("Triggered scheduled midnight cleanup for Asia/Kolkata");
        cleanupStalePosts();
    }

    public CleanupReport cleanupStalePosts() {
        if (!isCleaning.compareAndSet(false, true)) {
            logger.info("Cleanup is already running in another thread. Skipping concurrent execution.");
            return new CleanupReport(0, 0, 0, 0);
        }

        try {
            LocalDate today = LocalDate.now(KOLKATA_ZONE);
            logger.info("Cleanup started for stale posts before {} (Asia/Kolkata)", today);

            List<Post> stalePosts = postRepository.findByPostDateLessThan(today);
            int postsFound = stalePosts.size();
            logger.info("Found {} stale post(s) to process", postsFound);

            if (stalePosts.isEmpty()) {
                logger.info("No stale posts found. Cleanup complete.");
                return new CleanupReport(0, 0, 0, 0);
            }

            int postsDeleted = 0;
            int storageDeleted = 0;
            int storageFailed = 0;

            for (Post post : stalePosts) {
                if (Boolean.TRUE.equals(post.getHasPhoto()) && post.getImagePath() != null) {
                    String imagePath = post.getImagePath();
                    boolean deleteSucceeded = imageService.deleteStorageObject(imagePath);

                    if (deleteSucceeded) {
                        storageDeleted++;
                        postRepository.delete(post);
                        postsDeleted++;
                        logger.info("Deleted Storage object {} and database post id={}", imagePath, post.getId());
                    } else {
                        storageFailed++;
                        logger.warn("Storage deletion failed for object '{}'. Post id={} retained in database for later retry.",
                                imagePath, post.getId());
                    }
                } else {
                    // Text-only post: no Storage deletion required
                    postRepository.delete(post);
                    postsDeleted++;
                    logger.info("Deleted stale text-only database post id={}", post.getId());
                }
            }

            logger.info("Cleanup completed: Found={}, DeletedPosts={}, DeletedStorageObjects={}, FailedStorageDeletions={}",
                    postsFound, postsDeleted, storageDeleted, storageFailed);

            return new CleanupReport(postsFound, postsDeleted, storageDeleted, storageFailed);
        } finally {
            isCleaning.set(false);
        }
    }
}
