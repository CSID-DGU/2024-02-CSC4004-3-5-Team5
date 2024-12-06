# 2024-02-CSC4004-3-5-Team5
2024-02 공개SW프로젝트 Team5 - 기사 키우기

# 🎮기술스택
<div>
  <img src="https://img.shields.io/badge/React Native-61DAFB?style=for-the-badge&logo=React&logoColor=black"/>
  <img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white"/>
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white"> 
  <img src="https://img.shields.io/badge/AmazonAWS-000000?style=for-the-badge&logo=AmazonAWS&logoColor-000000">
</div>

# 🎮 팀원
|이름|학과|학번|
|------|---|---|
|임영준|컴퓨터공학전공|2020|
|류창선|경영학과|2022111335|
|안성현|컴퓨터공학전공|2020112736|
|이제혁|컴퓨터공학전공|2020112040|
|장준혁|컴퓨터공학전공|2020113396|

# 🎮 프로젝트 개요
test

# 🎮 주요 기능
![image](https://github.com/user-attachments/assets/cf5b44fa-f855-44d0-abd4-f252ff039524)
### 1. 회원 관리 기능
 카카오톡 소셜 로그인을 통해 간편한 회원가입 및 로그인을 제공하며, 사용자 프로필 정보(닉네임, 프로필 사진 등)를 가져와 계정을 생성 및 관리한다. 마이페이지에서는 닉네임, 한줄 소개, 신뢰도, 아이돌, 활동 지역 등의 개인 정보를 조회 및 수정할 수 있다. 

### 2. 아이돌 스케줄 조회 기능
 사용자가 선택한 아이돌의 스케줄을 달력 형태로 보여주며, 특정 스케줄 클릭 시 상세 정보를 통해 원본 링크 및 티켓팅 정보를 조회한다. 사용자 편의를 위해 캘린더 보기, 어제/오늘/내일 보기 2가지 방식을 제공한다.

### 3. 티켓팅 대리 해주기 / 구하기 기능
 대리인과 신청인을 매칭해준 뒤 단계별 진행사항과 채팅방 생성을 통해 대리 티켓팅이 이루어질 수 있게 한다. 티켓팅 신청인은 대리인과 실시간 채팅 기능을 통해 대화를 나눌 수 있고, 대리인은 티켓팅 결과를 업로드 하여 확인한 후에 송금을 진행할 수 있다.
* 티켓팅 대리 신청하기 – 달력 UI에서 해당 콘서트가 열리는 날짜를 클릭하여 대리인의 희망 조건을 입력하여 대리인을 매칭한다.
* 티켓팅 대리하기 – 달력 UI에서 해당 콘서트가 열리는 날짜를 클릭하여 매칭 요청 리스트 중에 선택하여 신청인을 매칭한다.

### 4. 동행 기능
선택한 스케줄에 사용자가 원하는 동행을 만들어 구할 수 있다. 동행 모집 시 입력하는 상세 정보는 희망하는 날짜, 시간, 연령대, 인원 수, 성별, 하고 싶은 말, 규칙으로 구성된다. 동행이 만들어지면 ‘전체’, ‘모집 중’, ‘완료’ 를 선택해 필터링해 볼 수 있다. 

### 6. 채팅 및 신고 기능
실시간 채팅 기능을 통해 매칭된 티켓팅 대리인과의 일대일 대화 및 동행 모집원들과의 다대다 대화를 지원한다. 채팅 내에서는 프로필 확인, 신고 기능을 제공하여 신뢰도와 안전성을 확보할 수 있다. 사용자는 부적절한 행동을 한 유저를 신고할 수 있고, 관리자는 신고 내용을 확인 후 적절한 조치를 취한다.
