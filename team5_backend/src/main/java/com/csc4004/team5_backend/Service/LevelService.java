package com.csc4004.team5_backend.Service;

import com.csc4004.team5_backend.Entity.User;
import com.csc4004.team5_backend.Repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class LevelService {
    private final UserRepository userRepository;

    public Map<String, Object> updateExp(User user) {
        Map<String, Object> result = new LinkedHashMap<>();
        User currentUser = userRepository.findById(user.getUserID())
                        .orElseThrow(() -> new EntityNotFoundException("Logined User Not In User Database"));

        result.put("userID", currentUser.getUserID());
        result.put("userName", currentUser.getUserName());

        // updateCount : winCount + 1
        currentUser.setWinCount(currentUser.getWinCount() + 1);
        result.put("winCount", currentUser.getWinCount());

        // updateExp : previousExp + consecutiveDay * newsExp(by difficulty) ?
        int previousExp = currentUser.getExp();
        int currentExp = previousExp + (int)(1 + currentUser.getConsecutiveDay() * 0.1) * 100; // test
        currentUser.setExp(currentExp);
        result.put("gainedExp", currentExp - previousExp);

        // updateLevel
        int previousLevel = currentUser.getLevel();
        int currentLevel = levelLogic(currentExp);
        if (currentLevel != previousLevel) {
            currentUser.setLevel(currentLevel);
            result.put("levelUp", true);
            result.put("previousLevel", previousLevel);
            result.put("currentLevel", currentLevel);
        }
        else {
            result.put("levelUp", false);
        }
        userRepository.save(currentUser);
        return result;
    }

    public int levelLogic(int currentExp) {
        if (currentExp < 100) return 1;
        if (currentExp < 300) return 2;
        if (currentExp < 600) return 3;
        if (currentExp < 1000) return 4;

        // 5레벨 이상은 경험치 범위에 따라 계산
        int level = 5;
        int[] thresholds = {1000, 5000, 10000, 20000, 50000, 100000};
        int[] levelRanges = {9, 20, 20, 20, 20, 11}; // 각 구간의 레벨 수 (9~100)

        for (int i = 0; i < thresholds.length; i++) {
            int maxLevel = level + levelRanges[i];
            int expPerLevel = thresholds[i] / levelRanges[i];

            for (int lvl = level; lvl < maxLevel; lvl++) {
                if (currentExp < 1000 + expPerLevel * (lvl - 4)) {
                    return lvl;
                }
            }
            // 해당 구간을 넘어섰다면 다음 구간으로 이동
            level = maxLevel;
        }
        return 100; // 경험치가 100레벨 이상이면 최고 레벨 반환
    }
}
