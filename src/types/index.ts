export interface SubGoal {
  id: string;
  name: string;
  icon: string;
}

export interface Activity {
  id: string;
  name: string;
  icon: string;
  subGoals?: SubGoal[];
  isScored?: boolean; // If false, doesn't count toward XP (like notes)
}

export interface SubGoalData {
  [subGoalId: string]: boolean;
}

export interface DailyData {
  [key: string]: boolean | string | SubGoalData | undefined;
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

export interface UserConfig {
  activities: Activity[];
  customized: boolean;
}

// Default game-themed activities with sub-goals
export const DEFAULT_ACTIVITIES: Activity[] = [
  { 
    id: 'strength', 
    name: 'Strength', 
    icon: '💪',
    isScored: true,
    subGoals: [
      { id: 'gym', name: 'Gym', icon: '🏋️' },
      { id: 'cardio', name: 'Cardio', icon: '🏃' },
      { id: 'stretching', name: 'Stretching', icon: '🧘‍♂️' },
    ]
  },
  { 
    id: 'knowledge', 
    name: 'Knowledge', 
    icon: '📚',
    isScored: true,
    subGoals: [
      { id: 'reading', name: 'Reading', icon: '📖' },
      { id: 'courses', name: 'Courses', icon: '🎓' },
      { id: 'research', name: 'Research', icon: '🔬' },
    ]
  },
  { 
    id: 'productivity', 
    name: 'Productivity', 
    icon: '⚡',
    isScored: true,
    subGoals: [
      { id: 'work', name: 'Work Tasks', icon: '💼' },
      { id: 'projects', name: 'Projects', icon: '🎯' },
      { id: 'planning', name: 'Planning', icon: '📋' },
    ]
  },
  { 
    id: 'mind', 
    name: 'Mind', 
    icon: '🧠',
    isScored: true,
    subGoals: [
      { id: 'meditation', name: 'Meditation', icon: '🧘' },
      { id: 'yoga', name: 'Yoga', icon: '🪷' },
      { id: 'journaling', name: 'Journaling', icon: '✍️' },
    ]
  },
  { 
    id: 'coolness', 
    name: 'Coolness', 
    icon: '😎',
    isScored: true,
    subGoals: [
      { id: 'social', name: 'Social', icon: '👥' },
      { id: 'hobbies', name: 'Hobbies', icon: '🎨' },
      { id: 'adventure', name: 'Adventure', icon: '🗺️' },
    ]
  },
  { 
    id: 'notes', 
    name: 'Life Notes', 
    icon: '📝',
    isScored: false, // Notes don't count for XP
  },
];

// Mapping from old activity IDs to new ones for backward compatibility
export const LEGACY_ACTIVITY_MAP: Record<string, string> = {
  'gym': 'strength',
  'books': 'knowledge',
  'office': 'productivity',
  'mental': 'mind',
  'coolness': 'coolness',
  'notes': 'notes',
};

