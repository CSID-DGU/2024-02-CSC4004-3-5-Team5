package com.csc4004.team5_backend.Service;

import com.csc4004.team5_backend.Entity.User;
import com.csc4004.team5_backend.Repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class LevelService {
    private final UserRepository userRepository;

    public Map<String, Object> updateExp(User user, int newsId) {
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
        int currentExp = previousExp + 100 + 10 * currentUser.getConsecutiveDay();
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

        // update read news
        List<Integer> readNews = currentUser.getIntegers();
        readNews.add(newsId);
        currentUser.setIntegers(readNews);

        userRepository.save(currentUser);
        return result;
    }

    public int levelLogic(int currentExp) {
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

        for (int i = 1; i <= 100; i ++) {
            if (currentExp < threshold[i]) {
                return i;
            }
        }
        return 100;
    }
}
