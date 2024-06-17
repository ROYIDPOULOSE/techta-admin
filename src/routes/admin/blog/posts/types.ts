import { Timestamp } from 'firebase/firestore';

export interface BlogData {
    id: string;
    title: string;
    auther: string;
    date: string;
    status: string;
    priority: string;
    imageUrl?: string;
    authorImageUrl?: string;
    lastUpdated: Timestamp;
  }