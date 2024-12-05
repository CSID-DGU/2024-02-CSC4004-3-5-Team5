from flask import Flask, request, jsonify
import requests
import json
import rag

app = Flask(__name__)

@app.route('/receive_json', methods=['POST'])
def receive_json():
    data = request.get_json()  # JSON 데이터 수신
    print("받은 question 데이터:", data)
    
    # JSON 데이터를 파일로 저장
    with open('question.json', 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)
    
    #대답 생성
    answer_data = rag.RAG()

    print("대답:",answer_data)

    return jsonify({"status": "success", "received": data,"answer":answer_data}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

