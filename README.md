# 고래잇! 알뜰한 11월 장보기

사용자가 제작한 행사 포스터를 바탕으로 구현한 반응형 캠페인 웹 시안입니다. 공식 운영 페이지가 아닙니다.

## 실행

Node.js 22 이상과 Python 3 환경에서 별도 패키지 설치 없이 동작합니다.

```sh
npm test
npm run build
npm start
```

http://localhost:8000 에서 확인합니다. ES 모듈을 사용하므로 index.html을 파일 탐색기에서 직접 열기보다 로컬 서버로 실행합니다.

## GitHub Pages 배포

1. GitHub에서 `goraeit-november-market` 저장소를 생성합니다.
2. 이 폴더 전체를 main 브랜치에 올립니다. `.github/workflows/pages.yml`도 포함합니다.
3. 저장소 Settings → Pages → Build and deployment → Source에서 **GitHub Actions**를 선택합니다.
4. Actions의 Deploy Goraeit to GitHub Pages 워크플로를 실행합니다.
5. 배포 성공 후 워크플로의 github-pages 환경 URL로 접속합니다.

저장소를 처음 연결한 후에는 main에 올릴 때 자동으로 테스트·빌드·배포합니다. 비공개 저장소의 Pages 지원 여부는 계정 요금제와 조직 정책에 따라 확인해야 합니다.

## 구현

- HTML/CSS/JavaScript ES 모듈. 외부 런타임 의존성 없음.
- 매장·방문 날짜·시간 조건 판별, 상세 모달, 혜택 기억하기, 금액 기준 미리보기, 계획 공유.
- 한국 시간 기준 행사 상태, 브라우저 저장 실패·복사 실패 대응.
- 키보드 접근, 네이티브 dialog, 모션 감소 설정 지원.
- 원본 포스터: assets/poster.webp. 고래 웹 에셋: assets/whale.webp.
- PRD.md에 행사 조건과 설계 기준이 있습니다. 할인 판별의 경계값은 tests/eligibility.test.js에서 검증합니다.

## 이미지 제작 기록

웹용 고래는 내장 이미지 생성 도구로 원본 포스터를 참조해 제작했습니다. 프롬프트: “Extract ONLY the large happy blue whale at top right carrying its yellow grocery basket, include its water spout. Preserve its friendly wink, pink cheeks, creamy ribbed belly, 3D soft shiny illustrative appearance and groceries. Remove background, typography, clouds, waves and unrelated illustrations. Single complete whale with basket on genuine transparent background, clean edges. Match original faithfully. No text.”

## 공개 전 확인

실제 점포 주소·상품 목록·재고는 포함하지 않았습니다. 쿠폰 발급·결제 기능은 없습니다. 다른 행사 간 중복 적용·시간 마감 기준·수량 제한 단위는 매장 확인이 필요합니다.

## 검증 범위

조건 판별 단위 테스트와 정적 빌드 검증을 포함합니다. 실제 브라우저 화면·모바일 성능·스크린리더의 최종 검수는 배포 환경에서 진행해야 합니다.
