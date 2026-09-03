package com.dailywander.repository;

import com.dailywander.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByPostDate(LocalDate postDate);

    long countByPostDateAndHasPhotoTrue(LocalDate postDate);

    List<Post> findByPostDateLessThan(LocalDate date);

    boolean existsByPostDateLessThan(LocalDate date);
}
