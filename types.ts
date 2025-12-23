
export enum Role {
  ADMIN = 'admin',
  ADS_SPECIALIST = 'ads_specialist',
  SOCIAL_MEDIA_SPECIALIST = 'social_media_specialist'
}

export enum Category {
  ORGANIC = 'Organik',
  PAID_ADS = 'Paid Ads'
}

export enum Channel {
  META_ADS = 'Meta Ads',
  GOOGLE_ADS = 'Google Ads',
  TIKTOK_ADS = 'Tiktok Ads',
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  WEBSITE = 'Website',
  TIKTOK = 'Tiktok',
  YOUTUBE = 'Youtube'
}

export enum Objective {
  AWARENESS = 'Awareness',
  CONSIDERATION = 'Consideration',
  CONVERSION = 'Conversion'
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: Role;
}

export interface MarketingData {
  id: string;
  date: string; // ISO string
  category: Category;
  channel: Channel;
  objective: Objective;
  metrics: Record<string, any>;
  userId: string;
}

export interface Task {
  id: string;
  title: string;
  label: string;
  content: string;
  status: 'todo' | 'in-progress' | 'done';
}

export type ViewType = 'dashboard' | 'data' | 'task' | 'management' | 'login';
