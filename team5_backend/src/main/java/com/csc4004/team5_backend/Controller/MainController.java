package com.csc4004.team5_backend.Controller;

import com.csc4004.team5_backend.Entity.User;
import com.csc4004.team5_backend.Service.LoginService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
public class MainController {
    private final LoginService loginService;

    @GetMapping("/main")
    public ResponseEntity<?> getRank() {
        Map<String, Object> response = new LinkedHashMap<>();

        try {
            List<User> ranking = loginService.getRank();
            if (ranking.isEmpty()) {
                throw new NullPointerException("User field is empty");
            }
            response.put("code", "SU");
            response.put("message", "Success.");
            response.put("ranking", ranking);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response.put("code", "Error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
