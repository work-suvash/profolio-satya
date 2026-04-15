export type ProjectComment = {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  avatar?: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  category: 'Cinematic Edits' | 'Reels & Shorts' | 'Gaming Montages' | 'Before / After' | 'Thumbnails';
  type: 'image' | 'video';
  thumbnail: string;
  src: string;
  views: number;
  likes: number;
  liked: boolean;
  comments: ProjectComment[];
  liveLink?: string;
};
