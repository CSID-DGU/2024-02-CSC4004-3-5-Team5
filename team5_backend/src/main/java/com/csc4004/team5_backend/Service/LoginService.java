package com.csc4004.team5_backend.Service;

import com.csc4004.team5_backend.DTO.GetTokenDTO;
import com.csc4004.team5_backend.DTO.KakaoUserDTO;
import com.csc4004.team5_backend.Entity.User;
import com.csc4004.team5_backend.Repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class LoginService {
    private final UserRepository userRepository;

    @Value("${kakao.client_id}")
    private String clientId;

    @Value("${kakao.redirect_uri}")
    private String redirectUri;

    public GetTokenDTO getAccessTokenFromKakao(String code) throws JsonProcessingException {
        String reqUrl = "https://kauth.kakao.com/oauth/token";
        RestTemplate rt = new RestTemplate();

        // HttpHeaders 객체
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        // HttpBody 객체
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);

        // HttpEntity 객체 생성
        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(params, headers);

        // POST 방식으로 요청 보내기
        ResponseEntity<String> response = rt.exchange(reqUrl, HttpMethod.POST, kakaoTokenRequest, String.class);

        String responseBody = response.getBody();
        ObjectMapper objectMapper = new ObjectMapper();
        GetTokenDTO authResponse = objectMapper.readValue(responseBody, GetTokenDTO.class);

        log.info("** Get Kakao Token Succeed.");

        return authResponse;
    }

    public KakaoUserDTO getKakaoInfo(String accessToken) throws JsonProcessingException {
        // HTTP Header 생성
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        // HTTP 요청 보내기
        HttpEntity<MultiValueMap<String, String>> kakaoUserInfoRequest = new HttpEntity<>(headers);
        RestTemplate rt = new RestTemplate();
        ResponseEntity<String> response = rt.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.POST,
                kakaoUserInfoRequest,
                String.class
        );

        // responseBody에 있는 정보 꺼내기
        String responseBody = response.getBody();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(responseBody);

        Long id = jsonNode.get("id").asLong();
        String profile_image = jsonNode.get("properties")
                .get("profile_image").asText();
        String nickname = jsonNode.get("properties")
                .get("nickname").asText();

        log.info("** Get Kakao User Info Succeed.");
        return KakaoUserDTO.builder()
                .id(id)
                .profile_image(profile_image)
                .nickname(nickname)
                .build();
    }

    public User register(KakaoUserDTO kakaoUserDTO) {
        Long id = kakaoUserDTO.getId();
        Optional<User> userInfo = userRepository.findById(id);
        log.info("login User -----" + userInfo);
        LocalDate today = LocalDate.now();

        // Register
        if (userInfo.isEmpty()) {
            User newUser = new User();
            newUser.setUserID(id);
            newUser.setUserName(kakaoUserDTO.getNickname());
            newUser.setProfileImage(kakaoUserDTO.getProfile_image());
            newUser.setLastAttendence(today);
            newUser.setLevel(1);
            newUser.setExp(0);
            newUser.setWinCount(0);
            newUser.setConsecutiveDay(1);
            userRepository.save(newUser);
            return newUser;
        }
        // login
        else {
            LocalDate previousDate = userRepository.findLastAttendenceById(id);
            if (previousDate.equals(today.minusDays(1))) {
                userRepository.updateConsecutiveDay(id);
            }
            else {
                if (!previousDate.equals(today)) {
                    userRepository.resetConsecutiveDay(id);
                }
            }
            userRepository.updateLastAttendence(id, today);
            return userInfo.get();
        }

    }

    public List<User> getRank() {
        return userRepository.findTop10ByOrderByExpDesc();
    }

    public List<Integer> getExp(User user) {
        int currentLevel = user.getLevel(); // 8
        int currentExp = user.getExp(); // 1100
        List<Integer> expList = new ArrayList<>();
        int[] threshold = {0, 100, 200, 320, 460, 620, 800, 1000, 1220, 1460,
                1720, 2000, 2300, 2620, 2960, 3320, 3700, 4100, 4520, 4960,
                5420, 5900, 6400, 6920, 7460, 8020, 8600, 9200, 9820, 10460,
                11120, 11800, 12500, 13220, 13960, 14720, 15500, 16300, 17120, 17960,
                18820, 19700, 20600, 21520, 22460, 23420, 24400, 25400, 26420, 27460,
                28520, 29600, 30700, 32138, 33610, 35117, 36659, 38237, 39851, 41501,
                43188, 44912, 46674, 48473, 50311, 52187, 54102, 56057, 58051, 60085,
                62160, 64276, 66433, 68632, 70873, 73157, 75484, 77854, 80268, 82727,
                85230, 87779, 90373, 93013, 95700, 98434, 101216, 104046, 106924, 109851,
                112828, 115855, 118932, 122060, 125240, 128472, 131756, 135093, 138484, 141929,
                Integer.MAX_VALUE};

        int gainedExpInThisLevel = currentExp - threshold[currentLevel - 1];
        int requiredExpForNextLevel = (currentLevel == 100) ? 0 : threshold[currentLevel] - currentExp;

        expList.add(0, gainedExpInThisLevel);
        expList.add(1, requiredExpForNextLevel);
        
        return expList;
    }
}
