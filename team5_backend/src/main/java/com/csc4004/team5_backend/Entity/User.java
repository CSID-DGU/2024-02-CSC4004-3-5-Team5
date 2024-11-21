package com.csc4004.team5_backend.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class User {
    @Id
    @Column(name = "userID", nullable = false)
    private Long userID;

    @Size(max = 10)
    @NotNull
    @Column(name = "userName", nullable = false, length = 10)
    private String userName;

    @Size(max = 255)
    @Column(name = "profileImage")
    private String profileImage;

    @Column(name = "level", columnDefinition = "int default 1")
    private Integer level;

    @Column(name = "exp", columnDefinition = "int default 0")
    private Integer exp;

    @Column(name = "winCount", columnDefinition = "int default 0")
    private Integer winCount;

    @Column(name = "lastAttendence")
    private LocalDate lastAttendence;

    @Column(name = "consecutiveDay", columnDefinition = "int default 1")
    private Integer consecutiveDay;
}
