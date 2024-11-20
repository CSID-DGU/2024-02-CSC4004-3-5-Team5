package com.csc4004.team5_backend.Controller;

import com.csc4004.team5_backend.DTO.GetNewsDTO;
import com.csc4004.team5_backend.Service.NewsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class NewsController {
    private final NewsService newsService;

    @PostMapping("/rag/news")
    public ResponseEntity<?> getNews(@RequestBody GetNewsDTO getNewsDTO) {
        Map<String, Object> response = new LinkedHashMap<>();

        try {
            if (getNewsDTO.getNewsTitle().isEmpty()) {
                throw new NullPointerException("newsTitle is empty");
            }
            else if (getNewsDTO.getNewsShort().isEmpty()) {
                throw new NullPointerException("newsShort is empty");
            }
            else if (getNewsDTO.getNewsFull().isEmpty()) {
                throw new NullPointerException("newsFull is empty");
            }
            else if (getNewsDTO.getQuizQuestion().isEmpty()) {
                throw new NullPointerException("QuizQuestion is empty");
            }
            else if (getNewsDTO.getQuizOption().isEmpty()) {
                throw new NullPointerException("QuizOption is empty");
            }
            else {
                int newsID = newsService.save(getNewsDTO);
                response.put("code", "SU");
                response.put("message", "Success");
                response.put("Stored newsID", newsID);
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            }
        } catch (Exception e) {
            response.put("code", "Error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
