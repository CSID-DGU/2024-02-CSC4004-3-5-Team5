package com.csc4004.team5_backend.Repository;

import com.csc4004.team5_backend.Entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface NewsRepository extends JpaRepository<News, Integer> {
    @Query(value = "SELECT * FROM News WHERE newsDate BETWEEN :start AND :end", nativeQuery = true)
    List<News> findByNewsDateBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
