package com.csc4004.team5_backend.Repository;

import com.csc4004.team5_backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findTop10ByOrderByExpDesc();
}
