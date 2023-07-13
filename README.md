Hello!

To Launch tests:
1) Install the dependencies via command: $npm install
2) To launch tests run command: $npm run test:chromium

To open build-in HTML report: $npm run test:report

Useful tips:
- headless: true, (to launch tests in visible browser ) [playwright.config.js]
- ['html', { open: 'always' }],  (set to 'never', or 'on-failure') [playwright.config.js] 
I've set it to - always, to show HTML report, and Logging.