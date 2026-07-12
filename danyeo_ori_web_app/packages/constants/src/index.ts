import type { CommunityPost, Festival } from "@danyeo-ori/types";

export const festivals: Festival[] = [
  { id: "semiwon", name: "세미원 연꽃문화제", period: "2026.06.26–08.17", location: "경기도 양평군", region: "경기", category: "문화", poster: "lotus", badge: "개최중", game: "사진 미션", likes: 1024 },
  { id: "jangsu", name: "장수 쿨밸리 페스티벌", period: "2026.07.17–07.19", location: "전북특별자치도 장수군", region: "전북", category: "물놀이", poster: "valley", badge: "추천", game: "계곡 피하기", likes: 2431 },
  { id: "geumsan", name: "금산 삼계탕축제", period: "2026.07.10–07.12", location: "충청남도 금산군", region: "충청", category: "먹거리", poster: "soup", badge: "먹거리", game: "재료 맞히기", likes: 826 },
  { id: "summer-beach", name: "서울썸머비치", period: "2026.07.20–08.09", location: "서울특별시 종로구", region: "서울", category: "물놀이", poster: "water", badge: "물놀이", game: "워터 타이밍", likes: 3091 },
  { id: "boryeong", name: "보령머드축제", period: "2026.07.24–08.09", location: "충청남도 보령시", region: "충청", category: "야간", poster: "firework", badge: "인기", game: "머드 슬라이드", likes: 4821 },
  { id: "hongcheon", name: "홍천 찰옥수수 축제", period: "2026년 여름 예정", location: "강원특별자치도 홍천군", region: "강원", category: "특산물", poster: "corn", badge: "특산물", game: "옥수수 먹기", likes: 1842 },
  { id: "bonghwa", name: "봉화은어축제", period: "2026.07.25–08.02", location: "경상북도 봉화군", region: "경북", category: "문화", poster: "night", badge: "야간", game: "은어 잡기", likes: 1231 },
  { id: "gyeyang", name: "계양아라온워터축제", period: "2026.07.17–07.19", location: "인천광역시 계양구", region: "인천", category: "가족", poster: "water", badge: "가족", game: "물총 미션", likes: 980 },
  { id: "ulsan", name: "울산조선해양축제", period: "2026.07.24–07.26", location: "울산광역시 동구", region: "울산", category: "문화", poster: "beach", badge: "바다", game: "배 조립 퍼즐", likes: 715 }
];

export const initialPosts: CommunityPost[] = [
  { id: 866757, festival: "보령머드", category: "현장후기", title: "주차는 3번 입구가 훨씬 빨랐어요", author: "나스닥_나락장", time: "00:22", views: 147 },
  { id: 866756, festival: "산천어축제", category: "질문", title: "낚시 게임 쿠폰 실제 현장에서도 쓸 수 있나요?", author: "모험가덕후", time: "00:15", views: 98 },
  { id: 866755, festival: "장수쿨밸리", category: "현장후기", title: "계곡 물 온도 차갑고 오후 2시부터 사람 많아짐", author: "주말탐험가", time: "00:15", views: 87 },
  { id: 866754, festival: "홍천옥수수", category: "게임", title: "옥수수 한 박스 실제 가격표 공유합니다", author: "찰옥수수러버", time: "00:14", views: 232 },
  { id: 866753, festival: "서울썸머비치", category: "현장후기", title: "평일 저녁 방문 후기, 샤워실 대기 10분 정도", author: "성수나들이러", time: "00:14", views: 112 },
  { id: 866752, festival: "금산삼계탕", category: "질문", title: "아이랑 가기 좋은 프로그램 추천 부탁해요", author: "가족여행중", time: "00:11", views: 76 }
];
