import cron from 'node-cron';
import { resetWeeklyXP, resetMonthlyXP } from '@/lib/leaderboard';
import connectDB from '@/lib/mongodb';
import { sendNotificationToSubscription } from '../webnotifcation';
import { Player, Subscription } from '@/models';

let cronJobsInitialized = false;

/**
 * Initialize cron jobs for XP resets
 * - Weekly reset: Every Monday at 00:00 UTC
 * - Monthly reset: First day of each month at 00:00 UTC
 */
export function initializeCronJobs() {
  // Prevent multiple initializations
  if (cronJobsInitialized) {
    console.log('⏰ Cron jobs already initialized');
    return;
  }

  // Weekly XP Reset - Every Monday at 00:00 UTC
  cron.schedule('0 0 * * 1', async () => {
    try {
      console.log('⏰ Running weekly XP reset...');
      await connectDB();
      await resetWeeklyXP();
      console.log('✅ Weekly XP reset completed');
    } catch (error) {
      console.error('❌ Weekly XP reset failed:', error);
    }
  }, {
    timezone: 'UTC'
  });

  // Monthly XP Reset - First day of each month at 00:00 UTC
  cron.schedule('0 0 1 * *', async () => {
    try {
      console.log('⏰ Running monthly XP reset...');
      await connectDB();
      await resetMonthlyXP();
      console.log('✅ Monthly XP reset completed');
    } catch (error) {
      console.error('❌ Monthly XP reset failed:', error);
    }
  }, {
    timezone: 'UTC'
  });

  // Execute daily at 8am IST JOB to trigger notification for reminder to play
  cron.schedule('0 2 * * *', async()=>{
    await connectDB();
    // Find all subscriptions to send notifications
    const subscriptions = Subscription.find();
    if(!subscriptions) return;
    for await (const sub of subscriptions) {
      const player = await Player.findById(sub.userId);
      if(!player) continue;
      await sendNotificationToSubscription(sub, 'Time to track your daily journer!', 'Come back and log your progress today to keep your streak alive!');
    }
  }, {
    timezone: 'UTC'
  });

  cronJobsInitialized = true;
  console.log('✅ Cron jobs initialized successfully');
  console.log('  - Weekly XP reset: Every Monday at 00:00 UTC');
  console.log('  - Monthly XP reset: 1st of each month at 00:00 UTC');
}

export function isCronJobsInitialized(): boolean {
  return cronJobsInitialized;
}
