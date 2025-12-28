export interface Activity {
  id: string;
  name: string;
  icon: string;
}

export interface DailyData {
  [key: string]: boolean | string | undefined;
  notes?: string;
}

export interface ActivityData {
  [date: string]: DailyData;
}

export interface UserStats {
  level: number;
  experience: number;
  totalTasks: number;
  currentStreak: number;
  title: string;
}

