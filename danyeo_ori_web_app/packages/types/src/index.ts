export type FestivalCategory = "먹거리" | "물놀이" | "야간" | "가족" | "특산물" | "문화";

export interface Festival {
  id: string;
  name: string;
  period: string;
  location: string;
  region: string;
  category: FestivalCategory;
  poster: string;
  badge: string;
  game: string;
  likes: number;
}

export interface CommunityPost {
  id: number;
  festival: string;
  category: "공지" | "현장후기" | "질문" | "게임";
  title: string;
  author: string;
  time: string;
  views: number;
}
