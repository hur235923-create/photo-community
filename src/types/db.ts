export interface User {
  id: string;
  username: string;
  password: string;
  nickname: string;
  created_at: string;
}
export interface ShootingInfo {
  camera: string | null;
  lens: string | null;
  aperture: string | null;
  shutter_speed: string | null;
  iso: string | null;
  taken_at: string | null;
}

export interface Post extends ShootingInfo {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  category: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}
export interface PostImage {
  id: string;
  post_id: string;
  image_url: string;
  storage_path: string;
  sort_order: number;
}
export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
}
export interface Like {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}
