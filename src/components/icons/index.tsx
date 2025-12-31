// Custom dark-themed icons for Solo Leveling aesthetic
// All icons use purple/gold gradients matching the theme

import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Strength - Sword icon
export const StrengthIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="strengthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
    </defs>
    <path d="M14.121 10.48L17.657 7.944C18.048 7.653 18.5 7.5 19 7.5C20.1 7.5 21 8.4 21 9.5C21 10 20.847 10.452 20.556 10.843L18.02 14.379L19.5 15.859L18.09 17.27L16.68 15.86L15.27 17.27L13.86 15.86L14.121 10.48Z" stroke="url(#strengthGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 21L10 14" stroke="url(#strengthGrad)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 14L7.5 11.5L3.5 7.5L4.5 3.5L8.5 4.5L12.5 8.5L10 11" stroke="url(#strengthGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Knowledge - Book with magic icon
export const KnowledgeIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="knowledgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
    </defs>
    <path d="M4 19.5C4 18.1 5.1 17 6.5 17H20" stroke="url(#knowledgeGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.5 2H20V22H6.5C5.1 22 4 20.9 4 19.5V4.5C4 3.1 5.1 2 6.5 2Z" stroke="url(#knowledgeGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 6L12.5 8L14.5 8.5L12.5 9L12 11L11.5 9L9.5 8.5L11.5 8L12 6Z" fill="url(#knowledgeGrad)"/>
    <path d="M15 10L15.3 11.2L16.5 11.5L15.3 11.8L15 13L14.7 11.8L13.5 11.5L14.7 11.2L15 10Z" fill="url(#knowledgeGrad)"/>
  </svg>
);

// Productivity - Lightning bolt icon
export const ProductivityIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="productivityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="url(#productivityGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#productivityGrad)" fillOpacity="0.2"/>
  </svg>
);

// Mind - Brain/aura icon
export const MindIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="mindGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="3" stroke="url(#mindGrad)" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="6" stroke="url(#mindGrad)" strokeWidth="1" strokeDasharray="2 2" opacity="0.7"/>
    <circle cx="12" cy="12" r="9" stroke="url(#mindGrad)" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.5"/>
    <path d="M12 3V5M12 19V21M3 12H5M19 12H21M5.6 5.6L7 7M17 17L18.4 18.4M5.6 18.4L7 17M17 7L18.4 5.6" stroke="url(#mindGrad)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Coolness - Crown/star icon
export const CoolnessIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="coolnessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="url(#coolnessGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#coolnessGrad)" fillOpacity="0.2"/>
  </svg>
);

// Notes - Scroll icon
export const NotesIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="notesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b96a5" />
        <stop offset="100%" stopColor="#6b7280" />
      </linearGradient>
    </defs>
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="url(#notesGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="url(#notesGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 13H16M8 17H12" stroke="url(#notesGrad)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Sub-goal icons

// Gym - Dumbbell
export const GymIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="gymGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
    </defs>
    <path d="M6.5 6.5V17.5M17.5 6.5V17.5M6.5 12H17.5M4 8.5V15.5M20 8.5V15.5M2 10V14M22 10V14" stroke="url(#gymGrad)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Cardio - Running figure
export const CardioIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="cardioGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
    </defs>
    <circle cx="17" cy="4" r="2" stroke="url(#cardioGrad)" strokeWidth="1.5"/>
    <path d="M15 22V14L12 11L8 13V18" stroke="url(#cardioGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 13L12 11L15 8L18 9" stroke="url(#cardioGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Stretching - Yoga pose
export const StretchingIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="stretchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="4" r="2" stroke="url(#stretchGrad)" strokeWidth="1.5"/>
    <path d="M4 17L8 13L12 15L16 13L20 17" stroke="url(#stretchGrad)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 7V15M8 10L12 7L16 10" stroke="url(#stretchGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Reading - Open book
export const ReadingIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="readGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
    </defs>
    <path d="M2 3H8C9.1 3 10.1 3.4 10.8 4.2C11.6 4.9 12 5.9 12 7V21C12 20.2 11.7 19.5 11.1 18.9C10.5 18.3 9.8 18 9 18H2V3Z" stroke="url(#readGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 3H16C14.9 3 13.9 3.4 13.2 4.2C12.4 4.9 12 5.9 12 7V21C12 20.2 12.3 19.5 12.9 18.9C13.5 18.3 14.2 18 15 18H22V3Z" stroke="url(#readGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Courses - Graduation cap
export const CoursesIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="courseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
    </defs>
    <path d="M12 3L2 8L12 13L22 8L12 3Z" stroke="url(#courseGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 10V16L12 20L19 16V10" stroke="url(#courseGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 8V15" stroke="url(#courseGrad)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Research - Microscope/flask
export const ResearchIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="researchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
    </defs>
    <path d="M9 3H15M10 3V8L6 18C5.8 18.7 5.9 19.3 6.3 19.7C6.7 20.1 7.3 20.2 8 20H16C16.7 20.2 17.3 20.1 17.7 19.7C18.1 19.3 18.2 18.7 18 18L14 8V3" stroke="url(#researchGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 14H16" stroke="url(#researchGrad)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Work - Briefcase
export const WorkIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="workGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
    <rect x="2" y="7" width="20" height="14" rx="2" stroke="url(#workGrad)" strokeWidth="1.5"/>
    <path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke="url(#workGrad)" strokeWidth="1.5"/>
    <path d="M12 12V14" stroke="url(#workGrad)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M2 12H22" stroke="url(#workGrad)" strokeWidth="1.5"/>
  </svg>
);

// Projects - Target
export const ProjectsIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="projectGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#projectGrad)" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="6" stroke="url(#projectGrad)" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="2" fill="url(#projectGrad)"/>
  </svg>
);

// Planning - Clipboard
export const PlanningIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="planGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
    <path d="M16 4H18C19.1 4 20 4.9 20 6V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V6C4 4.9 4.9 4 6 4H8" stroke="url(#planGrad)" strokeWidth="1.5"/>
    <rect x="8" y="2" width="8" height="4" rx="1" stroke="url(#planGrad)" strokeWidth="1.5"/>
    <path d="M9 12L11 14L15 10" stroke="url(#planGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 18H15" stroke="url(#planGrad)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Meditation - Lotus position
export const MeditationIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="meditateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="5" r="2" stroke="url(#meditateGrad)" strokeWidth="1.5"/>
    <path d="M8 22C8 18 8 15 12 12C16 15 16 18 16 22" stroke="url(#meditateGrad)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 18C6 16 8 15 12 12C16 15 18 16 20 18" stroke="url(#meditateGrad)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 9V12" stroke="url(#meditateGrad)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Yoga - Lotus flower
export const YogaIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="yogaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
    </defs>
    <path d="M12 22C12 22 8 18 8 14C8 12 10 10 12 10C14 10 16 12 16 14C16 18 12 22 12 22Z" stroke="url(#yogaGrad)" strokeWidth="1.5"/>
    <path d="M12 10C12 10 10 6 6 6C6 10 10 12 12 10Z" stroke="url(#yogaGrad)" strokeWidth="1.5"/>
    <path d="M12 10C12 10 14 6 18 6C18 10 14 12 12 10Z" stroke="url(#yogaGrad)" strokeWidth="1.5"/>
    <path d="M12 10V6" stroke="url(#yogaGrad)" strokeWidth="1.5"/>
    <circle cx="12" cy="4" r="2" stroke="url(#yogaGrad)" strokeWidth="1.5"/>
  </svg>
);

// Journaling - Pen and paper
export const JournalingIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="journalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
    </defs>
    <path d="M12 20H21" stroke="url(#journalGrad)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16.5 3.5C16.9 3.1 17.4 2.9 18 2.9C18.6 2.9 19.1 3.1 19.5 3.5C19.9 3.9 20.1 4.4 20.1 5C20.1 5.6 19.9 6.1 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke="url(#journalGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Social - People
export const SocialIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="socialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <circle cx="9" cy="7" r="3" stroke="url(#socialGrad)" strokeWidth="1.5"/>
    <path d="M3 21V19C3 16.8 4.8 15 7 15H11C13.2 15 15 16.8 15 19V21" stroke="url(#socialGrad)" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="17" cy="8" r="2.5" stroke="url(#socialGrad)" strokeWidth="1.5"/>
    <path d="M21 21V19.5C21 17.8 19.7 16.5 18 16.5H16.5" stroke="url(#socialGrad)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Hobbies - Palette
export const HobbiesIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="hobbyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C12.8 22 13.5 21.3 13.5 20.5C13.5 20.1 13.3 19.8 13.1 19.5C12.9 19.3 12.8 19 12.8 18.5C12.8 17.7 13.4 17 14.3 17H16C19.3 17 22 14.3 22 11C22 6 17.5 2 12 2Z" stroke="url(#hobbyGrad)" strokeWidth="1.5"/>
    <circle cx="8" cy="10" r="1.5" fill="url(#hobbyGrad)"/>
    <circle cx="12" cy="7" r="1.5" fill="url(#hobbyGrad)"/>
    <circle cx="16" cy="10" r="1.5" fill="url(#hobbyGrad)"/>
  </svg>
);

// Adventure - Compass
export const AdventureIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="adventureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#adventureGrad)" strokeWidth="1.5"/>
    <path d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z" stroke="url(#adventureGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#adventureGrad)" fillOpacity="0.2"/>
  </svg>
);

// Icon map for easy lookup
export const ICON_MAP: Record<string, React.FC<IconProps>> = {
  // Main activities
  'strength': StrengthIcon,
  'knowledge': KnowledgeIcon,
  'productivity': ProductivityIcon,
  'mind': MindIcon,
  'coolness': CoolnessIcon,
  'notes': NotesIcon,
  // Sub-goals
  'gym': GymIcon,
  'cardio': CardioIcon,
  'stretching': StretchingIcon,
  'reading': ReadingIcon,
  'courses': CoursesIcon,
  'research': ResearchIcon,
  'work': WorkIcon,
  'projects': ProjectsIcon,
  'planning': PlanningIcon,
  'meditation': MeditationIcon,
  'yoga': YogaIcon,
  'journaling': JournalingIcon,
  'social': SocialIcon,
  'hobbies': HobbiesIcon,
  'adventure': AdventureIcon,
};

// Helper component to render icon by ID
export const ActivityIcon: React.FC<{ id: string; size?: number; className?: string }> = ({ 
  id, 
  size = 24, 
  className = '' 
}) => {
  const IconComponent = ICON_MAP[id];
  if (IconComponent) {
    return <IconComponent size={size} className={className} />;
  }
  // Fallback for unknown icons - return a generic icon
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke="#6d28d9" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="3" fill="#fbbf24"/>
    </svg>
  );
};
