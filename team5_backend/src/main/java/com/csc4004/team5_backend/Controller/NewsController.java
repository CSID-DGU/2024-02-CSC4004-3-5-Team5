package com.csc4004.team5_backend.Controller;

import com.csc4004.team5_backend.DTO.GetNewsDTO;
import com.csc4004.team5_backend.Entity.News;
import com.csc4004.team5_backend.Entity.User;
import com.csc4004.team5_backend.Repository.UserRepository;
import com.csc4004.team5_backend.Service.LevelService;
import com.csc4004.team5_backend.Service.NewsService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Slf4j
public class NewsController {
    private final NewsService newsService;
    private final LevelService levelService;

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

    @GetMapping("/news")
    public ResponseEntity<?> getNowNews() {
        Map<String, Object> response = new LinkedHashMap<>();
        LocalDateTime now = LocalDateTime.now(); // "2024-11-20T20:04:46.561371"

        try {
            List<News> newsList = newsService.getNowNews(now);
            if (newsList.isEmpty()) {
                throw new Exception("news not found : " + now);
            }
            response.put("code", "SU");
            response.put("message", newsList.size() + " news found Succeed.");
            response.put("request time", now);
            response.put("newsList", newsList);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response.put("code", "Error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/exp")
    public ResponseEntity<?> updateExp(HttpSession session) {
        Map<String, Object> response = new LinkedHashMap<>();
        User loginUser = (User) session.getAttribute("userInfo");

        try {
            if (loginUser == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
            }
            Map<String, Object> resultInfoMap = levelService.updateExp(loginUser);
            response.put("code", "SU");
            response.put("message", "update Exp Successfully.");
            response.put("info", resultInfoMap);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response.put("code", "Error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    }
}
