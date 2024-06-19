import { Timestamp } from 'firebase/firestore';

export interface StudentData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
    courseStatus: string;
    courses: string[];
    studentImageUrl: string;
    lastUpdated: Timestamp;
  }