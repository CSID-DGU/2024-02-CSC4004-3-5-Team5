package com.csc4004.team5_backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
@Entity
public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "newsID")
    private Integer newsID;

    @Column(name = "newsTitle")
    private String newsTitle;

    @Column(name = "newsShort")
    private String newsShort;

    @Lob
    @Column(name = "newsFull")
    private String newsFull;

    @Column(name = "quizQuestion")
    private String quizQuestion;

    @Column(name = "quizAnswer") // 0, 1, 2, 3
    private Integer quizAnswer;

    @Column(name = "quizOption")
    private String quizOption;
}
