package com.csc4004.team5_backend.Repository;

import com.csc4004.team5_backend.Entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findTop10ByOrderByExpDesc();

    @Query(value = "select lastAttendence from User where userID = :id", nativeQuery = true)
    LocalDate findLastAttendenceById(@Param("id") Long id);

    @Query(value = "update User set consecutiveDay = consecutiveDay + 1 where userID = :id", nativeQuery = true)
    @Transactional
    @Modifying
    void updateConsecutiveDay(@Param("id") Long id);

    @Query(value = "update User set consecutiveDay = 1 where userID = :id", nativeQuery = true)
    @Transactional
    @Modifying
    void resetConsecutiveDay(@Param("id") Long id);

    @Query(value = "update User set lastAttendence = :today where userID = :id", nativeQuery = true)
    @Transactional
    @Modifying
    void updateLastAttendence(@Param("id") Long id, @Param("today") LocalDate today);

}
