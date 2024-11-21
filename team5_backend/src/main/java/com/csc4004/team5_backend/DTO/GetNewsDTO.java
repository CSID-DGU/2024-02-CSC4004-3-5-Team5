package com.csc4004.team5_backend.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class GetNewsDTO {
    @NotBlank
    private String newsTitle;
    @NotBlank
    private String newsDate;
    @NotBlank
    private String newsShort;
    @NotBlank
    private String newsFull;
    @NotBlank
    private String quizQuestion;
    @NotBlank
    private Integer quizAnswer;
    @NotBlank
    private List<String> quizOption;
}
