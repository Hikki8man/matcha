export interface Photo {
  id: number;
  user_id: number;
  filename: string;
  path: string;
  content_type: string;
  size: number;
  created_at: Date;
  photo_type: PhotoType;
}

export enum PhotoType {
  Avatar = 'avatar',
  Photo_1 = 'photo_1',
  Photo_2 = 'photo_2',
  Photo_3 = 'photo_3',
  Photo_4 = 'photo_4',
  Photo_5 = 'photo_5',
}
