from flask import Flask, jsonify
import requests
import json
import threading
import time
import rag

app = Flask(__name__)

def send_json_periodically():
    while True:
        try:
            # JSON 데이터 생성
            print("JSON 데이터 생성")
            rag.json_file_create()
            with open('news_data.json', 'r', encoding='utf-8') as json_file:
                data = json.load(json_file)  # 파일에서 JSON 데이터 읽기

            # 다른 서버로 JSON 데이터 전송
            headers = {'Content-Type': 'application/json'}
            response = requests.post('http://000.000.000.000:0000/rag/news', json=data, headers=headers, verify=False)  # 백엔드 서버 주소 
            print(f"Sent JSON data: {data}, Response: {response.json()}")

            # 뉴스 크롤링 및 데이터베이스 업데이트
            print("뉴스 크롤링 및 데이터베이스 업데이트")
            try:
                headline_links = rag.get_headline_links()
                rag.crawling_news_MKVDB(headline_links)

            except Exception as e:
                print(f"Error during crawling news: {e}")

            print("3600초 대기")
            time.sleep(3600)

        except Exception as e:
            print(f"Error in send_json_periodically: {e}")
            time.sleep(10)  # 오류 발생 시 잠시 대기 후 재시도
@app.route('/send_json', methods=['POST'])
def send_json():
    return jsonify({'status': 'success', 'message': 'JSON data is being sent periodically.'}), 200

if __name__ == '__main__':
    # 주기적으로 JSON 파일 전송 스레드 시작
    threading.Thread(target=send_json_periodically, daemon=True).start()
    app.run(host='0.0.0.0', port=5000, debug=False)
