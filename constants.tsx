
import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  CheckSquare, 
  Users, 
  LogOut, 
  Facebook, 
  Instagram, 
  Video, 
  Globe, 
  BarChart3 
} from 'lucide-react';
import { Channel, Category } from './types';

export const CHANNEL_CONFIG: Record<Channel, string[]> = {
  [Channel.META_ADS]: ['Tanggal Mulai', 'Tanggal Berakhir', 'Spend', 'Jangkauan', 'Impresi', 'CPM', 'Klik Tautan', 'CTR Tautan', 'CPC Tautan', 'Leads', 'Closing', 'CPR', 'Revenue', 'ROAS', 'Noted'],
  [Channel.GOOGLE_ADS]: ['Tanggal Mulai', 'Tanggal Berakhir', 'Spend', 'Impresi', 'Klik', 'CPC', 'CTR', 'Leads', 'Closing', 'Revenue', 'ROAS'],
  [Channel.TIKTOK_ADS]: ['Tanggal Mulai', 'Tanggal Berakhir', 'Spend', 'Jangkauan', 'Impresi', 'CPM', 'Klik Tautan', 'CTR Tautan', 'CPC Tautan', 'Leads', 'Closing', 'CPR', 'Revenue', 'ROAS', 'Noted'],
  [Channel.FACEBOOK]: ['Tanggal Mulai', 'Tanggal Berakhir', 'Followers', 'Video', 'Reels', 'Gambar', 'Carousel', 'Konten', 'Jangkauan', 'Tayangan', 'Komentar', 'Dibagikan', 'Total Engagement', 'Leads', 'Closing', 'Budget', 'Revenue', 'Noted'],
  [Channel.INSTAGRAM]: ['Tanggal Mulai', 'Tanggal Berakhir', 'Followers', 'Video', 'Reels', 'Gambar', 'Carousel', 'Konten', 'Jangkauan', 'Impresi', 'Suka', 'Komentar', 'Dibagikan', 'Mengikuti', 'Disimpan', 'Total Engagement', 'Leads', 'Closing', 'Revenue', 'Budget', 'Noted'],
  [Channel.TIKTOK]: ['Tanggal Mulai', 'Tanggal Berakhir', 'Followers', 'Video', 'Reels', 'Gambar', 'Carousel', 'Konten', 'Jangkauan', 'Impresi', 'Suka', 'Komentar', 'Dibagikan', 'Mengikuti', 'Disimpan', 'Interaksi', 'Leads', 'Closing', 'Revenue', 'Budget', 'Noted'],
  [Channel.YOUTUBE]: ['Tanggal Mulai', 'Tanggal Berakhir', 'Subscribers', 'Videos', 'Shorts', 'Views', 'Watch Time', 'Engagement', 'Leads', 'Closing', 'Revenue', 'Noted'],
  [Channel.WEBSITE]: ['Tanggal Mulai', 'Tanggal Berakhir', 'Sessions', 'Users', 'Pageviews', 'Bounce Rate', 'Leads', 'Closing', 'Revenue', 'Noted'],
};

export const CATEGORY_CHANNELS: Record<Category, Channel[]> = {
  [Category.ORGANIC]: [Channel.FACEBOOK, Channel.INSTAGRAM, Channel.TIKTOK, Channel.YOUTUBE, Channel.WEBSITE],
  [Category.PAID_ADS]: [Channel.META_ADS, Channel.GOOGLE_ADS, Channel.TIKTOK_ADS]
};
