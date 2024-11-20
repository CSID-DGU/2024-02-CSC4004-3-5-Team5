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
        int currentExp = previousExp + currentUser.getConsecutiveDay() * 100; // test
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
        return 5; // 1000 이상은 레벨 5
    }
}
