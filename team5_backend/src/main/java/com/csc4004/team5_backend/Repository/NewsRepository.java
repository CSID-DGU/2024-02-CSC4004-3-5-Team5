package com.csc4004.team5_backend.Repository;

import com.csc4004.team5_backend.Entity.News;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository extends JpaRepository<News, Integer> {
}
