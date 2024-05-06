import { Timestamp } from 'firebase/firestore';

export interface StudentData {
    id: string;
    name: string;
    address: string;
    phone: string;
    status: string;
    course: string;
    lastUpdated: Timestamp;
  }