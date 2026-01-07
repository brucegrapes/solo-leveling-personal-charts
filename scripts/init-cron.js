#!/usr/bin/env node

/**
 * Initialize cron jobs by making a request to the cron-init endpoint
 * This ensures cron jobs are started after the server is up
 */

const http = require('http');

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

function initializeCronJobs() {
  const options = {
    hostname: HOST,
    port: PORT,
    path: '/api/cron-init',
    method: 'GET',
    timeout: 5000,
  };

  console.log('🚀 Initializing cron jobs...');

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Cron jobs initialized successfully');
        try {
          const response = JSON.parse(data);
          console.log('📋 Jobs:', response.jobs);
        } catch (e) {
          // Ignore parse errors
        }
      } else {
        console.error('❌ Failed to initialize cron jobs:', res.statusCode);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error initializing cron jobs:', error.message);
  });

  req.on('timeout', () => {
    console.error('❌ Timeout initializing cron jobs');
    req.destroy();
  });

  req.end();
}

// Wait a bit for the server to be ready, then initialize
setTimeout(initializeCronJobs, 2000);
