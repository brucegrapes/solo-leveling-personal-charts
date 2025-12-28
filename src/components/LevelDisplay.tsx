import { UserStats } from '@/types';

interface LevelDisplayProps {
  userStats: UserStats;
}

export default function LevelDisplay({ userStats }: LevelDisplayProps) {
  const xpForNextLevel = 100 + (userStats.level - 1) * 50;
  const progressPercent = (userStats.experience / xpForNextLevel) * 100;

  return (
    <div className="bg-sl-gray/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border-2 border-sl-gold/50 glow">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-sl-gold">Level {userStats.level}</h2>
          <p className="text-sl-light text-sm sm:text-base lg:text-lg">{userStats.title}</p>
        </div>
        <div className="text-right">
          <p className="text-xl sm:text-2xl font-bold text-white">{userStats.totalTasks}</p>
          <p className="text-sl-light text-xs sm:text-sm">Total Quests</p>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-xs sm:text-sm text-sl-light mb-1">
          <span>Experience</span>
          <span>{userStats.experience} / {xpForNextLevel} XP</span>
        </div>
        <div className="w-full bg-sl-dark rounded-full h-3 sm:h-4 border border-sl-purple/50">
          <div
            className="bg-gradient-to-r from-sl-blue to-sl-purple h-full rounded-full transition-all duration-500 ease-out glow-purple"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
        <div className="bg-sl-dark/50 rounded-lg p-2.5 sm:p-3 border border-sl-purple/30">
          <p className="text-sl-light text-xs sm:text-sm">Current Streak</p>
          <p className="text-lg sm:text-2xl font-bold text-sl-gold">{userStats.currentStreak} days</p>
        </div>
        <div className="bg-sl-dark/50 rounded-lg p-2.5 sm:p-3 border border-sl-purple/30">
          <p className="text-sl-light text-xs sm:text-sm">Next Level</p>
          <p className="text-lg sm:text-2xl font-bold text-sl-gold">{xpForNextLevel - userStats.experience} XP</p>
        </div>
      </div>
    </div>
  );
}
