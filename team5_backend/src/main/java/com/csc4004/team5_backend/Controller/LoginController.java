package com.csc4004.team5_backend.Controller;

import com.csc4004.team5_backend.DTO.GetTokenDTO;
import com.csc4004.team5_backend.DTO.KakaoUserDTO;
import com.csc4004.team5_backend.Entity.User;
import com.csc4004.team5_backend.Service.LoginService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@Slf4j
public class LoginController {
    @Autowired
    private HttpSession session;
    private final LoginService loginService;

    @GetMapping("/login")
    public ResponseEntity<?> RegisterLogin(@RequestBody String code) throws IOException {
        Map<String, Object> response = new LinkedHashMap<>();
        User loginUser = new User();

        try {
            GetTokenDTO accessToken = loginService.getAccessTokenFromKakao(code);
            KakaoUserDTO userInfo = loginService.getKakaoInfo(accessToken.getAccessToken());
            log.info(userInfo.toString());
            loginService.register(userInfo);

            loginUser.setUserID(userInfo.getId());
            loginUser.setUserName(userInfo.getNickname());
            loginUser.setProfileImage(userInfo.getProfile_image());

            session.setAttribute("userInfo", loginUser);
            session.setMaxInactiveInterval(60 * 60 * 24);

            response.put("code", "SU");
            response.put("message", "Success.");
            response.put("loginUser", userInfo);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response.put("code", "Error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    }

    @GetMapping("/stat")
    public ResponseEntity<?> getStat() {
        Map<String, Object> response = new LinkedHashMap<>();

        try {
            User user = (User) session.getAttribute("userInfo");
            response.put("code", "SU");
            response.put("message", "Success.");
            response.put("loginUser", user);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response.put("code", "Error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
