/**
 * Admin Configuration
 * Emergency kill switch for admin access
 */

export const ADMIN_CONFIG = {
  // Set to false to completely disable all admin access
  ADMIN_ENABLED: process.env.ADMIN_ENABLED === 'true',
  
  // Custom message to display when admin is disabled
  DISABLED_MESSAGE: '🚨 Admin access temporarily disabled for security reasons',
} as const;
