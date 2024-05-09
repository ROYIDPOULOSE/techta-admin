import { Timestamp } from 'firebase/firestore';

interface SoftwareData {
    id: string;
    software_name: string;
    duration: string;
    imageUrl: string;
    lastUpdated: Timestamp;
}