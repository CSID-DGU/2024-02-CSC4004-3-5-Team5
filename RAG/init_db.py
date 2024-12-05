import os
import shutil
from rag import crawling_news_MKVDB, get_headline_links

def main():
    # 기존 chroma_db 디렉토리 삭제
    db_directory = "chroma_db"
    if os.path.exists(db_directory):
        print(f"Deleting existing directory: {db_directory}")
        shutil.rmtree(db_directory)  # 디렉토리 삭제

    # 호출 횟수 설정
    num_calls = 5  # 원하는 호출 횟수

    for i in range(num_calls):
        print(f"Calling crawling_news_MKVDB for the {i + 1} time...")
        # 헤드라인 링크를 가져와서 crawling_news_MKVDB 호출
        headline_links = get_headline_links()
        vectorstore = crawling_news_MKVDB(headline_links)
        
        # 결과 확인 (필요에 따라 추가적인 처리)
        print(f"Vectorstore created for call {i + 1}: {vectorstore}")

if __name__ == "__main__":
    main()
