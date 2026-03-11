// playwright.config.js

const { defineConfig } = require('@playwright/test');
require('dotenv').config({ path: './config/.env' });

module.exports = defineConfig({

  testDir: './e2e',

  timeout: 30000,

  use: {
    baseURL: process.env.BASE_URL,
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  reporter: [['html', { open: 'never' }]],

});