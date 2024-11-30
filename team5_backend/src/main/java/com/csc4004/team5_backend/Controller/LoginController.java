package com.csc4004.team5_backend.Controller;

import com.csc4004.team5_backend.DTO.GetTokenDTO;
import com.csc4004.team5_backend.DTO.KakaoUserDTO;
import com.csc4004.team5_backend.Entity.User;
import com.csc4004.team5_backend.Service.LoginService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@Slf4j
public class LoginController {
    private final LoginService loginService;

    @GetMapping("/login")
    public ResponseEntity<?> RegisterLogin(@RequestParam("code") String code, HttpSession session) throws IOException {
        Map<String, Object> response = new LinkedHashMap<>();

        try {
            GetTokenDTO accessToken = loginService.getAccessTokenFromKakao(code);
            KakaoUserDTO userInfo = loginService.getKakaoInfo(accessToken.getAccessToken());
            log.info(userInfo.toString());
            User loginUser = loginService.register(userInfo);

            session.setAttribute("userInfo", loginUser);
            session.setMaxInactiveInterval(60 * 60 * 24);

            response.put("code", "SU");
            response.put("message", "Login Succeed.");
            response.put("loginUser", userInfo);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response.put("code", "Error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    }
}
