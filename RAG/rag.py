#!pip install tiktoken
#!pip install langchain
#!pip install langchain-openai
#!pip install langchain-community
#!pip install chromadb
#!pip install langchain-chroma


import os
import json
import requests
import bs4
from bs4 import BeautifulSoup
from langchain.chains import LLMChain
from langchain_community.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.memory import ConversationSummaryBufferMemory
from langchain_chroma import Chroma
import time
from dotenv import load_dotenv
from chromadb import Client
from langchain_core.runnables import RunnableLambda

load_dotenv()



###점수,링크 1사이클 웹 크롤링
def Best_News_cycle():
  # 네이버 뉴스 경제 섹션 URL
  url = "https://news.naver.com/section/101"

  # 페이지 가져오기
  response = requests.get(url)

  # HTML 파싱
  soup = BeautifulSoup(response.text, "html.parser")

  #점수,링크 리스트
  score = []
  headline = []

  # 점수 크롤링
  for span in soup.find_all('span', class_="sa_text_cluster_num"):
       score.append(span.text)

  # 링크 크롤링
  for link in soup.find_all('a', class_="sa_text_title _NLOG_IMPRESSION"):
    href = link.get("href")
    if href:
        headline.append(href)
    if len(headline) >= 10:
        break
  score = list(map(int,score))


  #최대점수 점수,링크 반환
  #maxs = score.index(max(score))
  maxs = 0;
  return score[maxs], headline[maxs]




###Best_News_cycle 5반복 후 최대점수 링크 추출
def Best_News():
  #점수,링크 리스트
  score = []
  headline = []

  #10초 간격 5번 크롤링
  for i in range (5):
    s,h = Best_News_cycle()
    #time.sleep(10)
    score.append(s)
    headline.append(h)

  #최대점수 점수,링크 반환
  #maxs = score.index(max(score))
  maxs = 0;
  return score[maxs], headline[maxs]



###대표뉴스 추출
def Best_News_elemenet(link):
  url = []
  url.append(link)

  #웹 크롤링 - 본문
  loader = WebBaseLoader(
    web_paths= url,
    bs_kwargs=dict(
        parse_only=bs4.SoupStrainer(
            class_=("go_trans _article_content")
        )
    ),
  )
  docs = loader.load()

  #웹 크롤링 - 제목
  loader = WebBaseLoader(
    web_paths= url,
    bs_kwargs=dict(
        parse_only=bs4.SoupStrainer(
            class_=("media_end_head_headline")
        )
    ),
  )
  title = loader.load()

  #웹 크롤링 - 날짜
  loader = WebBaseLoader(
    web_paths= url,
    bs_kwargs=dict(
        parse_only=bs4.SoupStrainer(
            class_=("media_end_head_info_datestamp_time _ARTICLE_DATE_TIME")
        )
    ),
  )
  date = loader.load()

  return docs, title, date




###뉴스요약
def summary(news):
  # Prompt
  template = '''
  This context is the full text of the news article. Summarize the news article in one or two lines and answer in Korean.
  Please answer with all major details included.
  Summarized sentences provide answers that are easy to understand even for people who don't know much about economics.:
  {context}'''

  prompt = ChatPromptTemplate.from_template(template)

  # LLM
  model = ChatOpenAI(model='gpt-4o-mini', temperature=0)

  # Chain 실행 (RunnableSequence 사용)
  answer = (prompt | model).invoke({"context": news})

  return answer




###퀴즈생성
def quiz(news):
  # Prompt
  template = '''
  Please make a 4-choice quiz using this context. All you have to do is create one question and 4 choices about it.
  Please write your answer in the format I specify. The answer in curly brackets is the format I want. You only need to fill in the information inside the brackets.
  Be sure to erase curly brackets and brackets from your answer.
  You must adhere to the following format for your answers.
  [Problem you created]\nA)[Section 1]\nB)[Section 2]\nC)[Section 3]\nD)[Section 4]\nAnswer: [alphabet, which is the correct answer among ABCD In all uppercase]
  Please create an answer in Korean:
  {context}'''

  prompt = ChatPromptTemplate.from_template(template)

  # LLM
  model = ChatOpenAI(model='gpt-4o-mini', temperature=0)

# Chain 실행 (RunnableSequence 사용)
  answer = (prompt | model).invoke({"context": news})

  return answer





###네이버 경제 뉴스에서 헤드라인 링크 추출
def get_headline_links():

  # 네이버 뉴스 경제 섹션 URL
  url = "https://news.naver.com/section/101"

  # 페이지 가져오기
  response = requests.get(url)

  # HTML 파싱
  soup = BeautifulSoup(response.text, "html.parser")

  # 헤드라인 뉴스 링크 리스트 생성
  headline_links = []

  # 'sa_text_title _NLOG_ IMPRESSION' 클래스를 가진 'a' 태그에서 링크 추출
  for link in soup.find_all('a', class_="sa_text_title _NLOG_IMPRESSION"):
    href = link.get("href")
    if href:
        headline_links.append(href)

  return headline_links




###기사 크롤링 -> vector db 생성
def crawling_news_MKVDB(headline_links):
  # 웹 크롤링
  loader = WebBaseLoader(
      web_paths=(headline_links),
      bs_kwargs=dict(
          parse_only=bs4.SoupStrainer(
            class_=("go_trans _article_content")
          )
      ),
  )
  docs = loader.load()

  # Text Split (Documents -> small chunks: Documents)
  text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
  splits = text_splitter.split_documents(docs)

  # Chroma DB 생성 및 로컬에 저장
  persist_directory = "chroma_db"  # 로컬 디렉토리 경로 설정
  embedding_function = OpenAIEmbeddings()  # 임베딩 함수 설정

  # Chroma DB 생성
  vectorstore = Chroma(persist_directory=persist_directory, embedding_function=embedding_function)

  # Indexing (Texts -> Embedding -> Store)
  vectorstore.add_documents(documents=splits)  # 문서 추가

  return vectorstore




### 사용자 질문 입력 -> vector db에서 유사도순 정보 추출 -> 답변 생성
## 프론트로부터 질문 내용 전달 받아서 이 함수 돌리고 답변 내용만 프론트
def LLM(vectorstore, ques):
    # 유사도 검색
    docs = vectorstore.similarity_search(ques)

    # Prompt
    template = '''You are an economic expert and a fairy that helps solve problems.
    If the following context is appropriate to answer the question, answer with reference to both the context and information you already know.
    If not, answer based on what you know.
    Explain the answer in an easy-to-understand manner.
    If the question is something you don't know, please answer that you don't know.
    Answers must be created in Korean.:
    {context}

    Question: {question}
    '''

    prompt = ChatPromptTemplate.from_template(template)

    # LLM
    model = ChatOpenAI(model='gpt-4o-mini', temperature=0)

    # Combine Documents - 상위 10청크
    def format_docs(docs):
        return '\n\n'.join(doc.page_content for doc in docs[:10])

    # RAG Chain 연결
    rag_chain = (
        {
            'context': RunnableLambda(lambda input: format_docs(input['docs'])),  
            'question': RunnableLambda(lambda input: input['question'])  
        }
        | prompt
        | model
        | StrOutputParser()
    )

    # Chain 실행
    answer = rag_chain.invoke({"docs": docs, "question": ques})  

    return answer

# Chroma DB 로드 시 임베딩 함수 제공
def load_chroma_db():
  persist_directory = "chroma_db"  # 로컬 디렉토리 경로 설정
  embedding_function = OpenAIEmbeddings()  # 임베딩 함수 설정
  vectorstore = Chroma(persist_directory=persist_directory, embedding_function=embedding_function)
  return vectorstore



#RAG초기화
def RAG_init():
  vectorstore = load_chroma_db()
  return vectorstore


#질문 json 파일 로드
def load_ques_json():
  with open('question.json', 'r', encoding='utf-8') as json_file:
    data = json.load(json_file)
  return data



#대답 생성
def RAG():
  vectorstore = RAG_init()
  data = load_ques_json()
  ques = data['question']
  answer = LLM(vectorstore,ques)
  answer_data = {
    "answer": answer
  }

  return answer_data



#뉴스 요약 및 퀴즈 생성
def new_summary_and_quiz():
  score, headline = Best_News()
  news,title,date = Best_News_elemenet(headline)
  news = news[0].page_content
  title = title[0].page_content
  date = date[0].page_content
  news_summary = summary(news)
  news_quiz = quiz(news)

  return news_summary.content, news_quiz.content, title, date, news




# 퀴즈 문자열 파싱
def parse_quiz(quiz_string):
    # 입력 문자열을 줄 단위로 분할
    lines = quiz_string.strip().split('\n')
    
    # 질문과 보기, 정답 추출
    question = lines[0]  # 첫 번째 줄은 질문
    options = lines[1:5]  # 두 번째부터 다섯 번째 줄까지는 보기

    # 여섯 번째 또는 일곱 번째 줄에서 정답 추출
    answer_line = None
    if len(lines) > 5:
        answer_line = lines[5]  # 여섯 번째 줄
    if len(lines) > 6:
        answer_line = lines[6]  # 일곱 번째 줄
    
    # 정답에서 'Answer: ' 부분 제거
    answer = answer_line.split(': ')[1].strip() if answer_line else None
    
    # 정답을 정수형으로 변환
    answer_index = {'A': 0, 'B': 1, 'C': 2, 'D': 3}.get(answer, None)

    # 보기에서 'A)', 'B)', 'C)', 'D)' 제거
    options = [option[3:].strip() for option in options]

    return question, options, answer_index




#json 파일 생성
def json_file_create():
  #뉴스 요약 및 퀴즈 생성
  newsShort, quiz, title, date, newsFull = new_summary_and_quiz()
  quizQuestion, quizOption, quizAnswer = parse_quiz(quiz)

  #json 파일 생성
  data = {
    "newsTitle": title,
    "newsShort": newsShort,
    "newsFull": newsFull,
    "quizQuestion": quizQuestion,
    "quizOption": [
      quizOption[0],
      quizOption[1],
      quizOption[2],
      quizOption[3]  
    ],
    "quizAnswer": quizAnswer,
    "newsDate": date
  }

  json_data = json.dumps(data, ensure_ascii=False, indent=4)

  # JSON 파일로 저장
  with open('news_data.json', 'w', encoding='utf-8') as json_file:
    json_file.write(json_data)
 

