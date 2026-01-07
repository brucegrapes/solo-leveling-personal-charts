import { NextRequest, NextResponse } from 'next/server';
import { initializeCronJobs } from '@/services/cron';

// Force this route to use Node.js runtime (not Edge Runtime)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Initialize cron jobs when this module is first loaded (server startup)
initializeCronJobs();

/**
 * Health check endpoint for cron job service
 * GET /api/cron-init
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'Cron jobs are running',
    jobs: {
      weeklyReset: 'Every Monday at 00:00 UTC',
      monthlyReset: '1st of each month at 00:00 UTC'
    }
  });
}
