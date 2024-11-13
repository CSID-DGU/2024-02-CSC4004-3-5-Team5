package com.csc4004.team5_backend.Repository;

import com.csc4004.team5_backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
