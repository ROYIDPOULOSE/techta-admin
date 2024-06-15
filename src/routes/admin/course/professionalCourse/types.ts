import { Timestamp, FieldValue } from 'firebase/firestore';

export interface ModuleData {
    moduleName: string;
    description: string;
  }

  export interface CourseData {
    id: string;
    course_name: string;
    software: string[];
    duration: number;
    course_discription: string;
    delivery_mode: string;
    schedule: string;
    prerequisites: string;
    stream: string;
    courseImageUrl: string;
    lastUpdated: Timestamp | FieldValue;
    modules?: ModuleData[];
    courseType: string;
    ourbest: boolean;
  }