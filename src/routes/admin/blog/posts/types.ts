import { Timestamp } from 'firebase/firestore';

export interface BlogData {
    id: string;
    title: string;
    authorName: string;
    createdAt: string;
    status: string;
    permalink: string;
    autherDesignation: string;
    priority: string;
    imageUrl?: string;
    authorImageUrl?: string;
    lastUpdated: Timestamp;
  }