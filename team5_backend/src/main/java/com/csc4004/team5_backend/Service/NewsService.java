package com.csc4004.team5_backend.Service;

import com.csc4004.team5_backend.DTO.GetNewsDTO;
import com.csc4004.team5_backend.Entity.News;
import com.csc4004.team5_backend.Repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class NewsService {
    private final NewsRepository newsRepository;

    public int save(GetNewsDTO getNewsDTO) {
        News news = News.builder()
                .newsTitle(getNewsDTO.getNewsTitle())
                .newsShort(getNewsDTO.getNewsShort())
                .quizQuestion(getNewsDTO.getQuizQuestion())
                .quizAnswer(getNewsDTO.getQuizAnswer())
                .quizOption(getNewsDTO.getQuizOption().toString())
                .newsDate(getNewsDTO.getNewsDate())
                .build();

        News newsTuple = newsRepository.save(news);
        return newsTuple.getNewsID();
    }

    public List<News> getNowNews(LocalDateTime now) {
        LocalDateTime hourAgo = now.minusHours(1);
        log.info("hourAgo -- " + hourAgo);
        log.info("timeNow -- " + now);
        return newsRepository.findByNewsDateBetween(hourAgo, now);
    }
}
