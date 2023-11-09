export interface Photo {
  id: number;
  user_id: number;
  filename: string;
  path: string;
  content_type: string;
  size: number;
  created_at: Date;
  avatar: boolean;
}
