package com.csc4004.team5_backend.Service;

import com.csc4004.team5_backend.DTO.GetNewsDTO;
import com.csc4004.team5_backend.Entity.News;
import com.csc4004.team5_backend.Repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
@Slf4j
@RequiredArgsConstructor
public class NewsService {
    private final NewsRepository newsRepository;

    public int save(GetNewsDTO getNewsDTO) {
        String dateTimeString = getNewsDTO.getNewsDate();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd. a h:mm", Locale.KOREAN);
        LocalDateTime convertedDateTime = LocalDateTime.parse(dateTimeString, formatter);

        News news = News.builder()
                .newsTitle(getNewsDTO.getNewsTitle())
                .newsShort(getNewsDTO.getNewsShort())
                .quizQuestion(getNewsDTO.getQuizQuestion())
                .quizAnswer(getNewsDTO.getQuizAnswer())
                .quizOption(getNewsDTO.getQuizOption().toString())
                .newsDate(convertedDateTime)
                .newsFull(getNewsDTO.getNewsFull())
                .build();

        News newsTuple = newsRepository.save(news);
        return newsTuple.getNewsID();
    }

    public List<News> getNowNews(LocalDateTime now) {
        LocalDateTime hourAgo = now.minusHours(3);
        log.info("hourAgo -- " + hourAgo);
        log.info("timeNow -- " + now);
        return newsRepository.findByNewsDateBetween(hourAgo, now);
    }
}
