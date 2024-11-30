package com.csc4004.team5_backend.Controller;

import com.csc4004.team5_backend.Entity.User;
import com.csc4004.team5_backend.Repository.UserRepository;
import com.csc4004.team5_backend.Service.LoginService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@Slf4j
@RequiredArgsConstructor
public class MainController {
    private final LoginService loginService;
    private final UserRepository userRepository;

    @GetMapping("/main")
    public ResponseEntity<?> getRank() {
        Map<String, Object> response = new LinkedHashMap<>();

        try {
            List<User> ranking = loginService.getRank();
            if (ranking.isEmpty()) {
                throw new NullPointerException("User field is empty");
            }

            List<Map<String, Object>> rankList = ranking.stream()
                    .map(user -> {
                        Map<String, Object> userMap = new LinkedHashMap<>();
                        userMap.put("userName", user.getUserName());
                        userMap.put("profileImage", user.getProfileImage());
                        userMap.put("level", user.getLevel());
                        userMap.put("exp", user.getExp());
                        return userMap;
                    })
                    .toList();

            response.put("code", "SU");
            response.put("message", "Success.");
            response.put("ranking", rankList);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response.put("code", "Error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/stat")
    public ResponseEntity<?> getStat(HttpSession session) {
        Map<String, Object> response = new LinkedHashMap<>();

        try {
            User user = (User) session.getAttribute("userInfo");
            if (user == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
            }
            else {
                User userStat = userRepository.findById(user.getUserID()).get();
                response.put("code", "SU");
                response.put("message", "Success.");
                response.put("loginUser", userStat);
                return ResponseEntity.status(HttpStatus.OK).body(response);
            }
        } catch (Exception e) {
            response.put("code", "Error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
