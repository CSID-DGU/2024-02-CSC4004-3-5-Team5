package com.csc4004.team5_backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
@Entity
public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "newsID", nullable = false)
    private Integer newsID;

    @Column(name = "newsTitle", nullable = false)
    private String newsTitle;

    @Lob
    @Column(name = "newsFull", nullable = false)
    private String newsFull;

    @Column(name = "quizQuestion")
    private String quizQuestion;

    @Column(name = "quizAnswer") // 0, 1, 2, 3
    private Integer quizAnswer;

    @Column(name = "quizOption")
    private String quizOption;
}
