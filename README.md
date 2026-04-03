# kit-playwright

A minimal Playwright project for end-to-end testing a JavaScript library across multiple devices.

## Project structure

```
kit-playwright/
├── src/
│   ├── lib.js        # The JavaScript library under test
│   └── main.html     # HTML page that loads and exercises the library
├── tests/
│   └── example.spec.js  # Example Playwright tests
├── devices.json      # List of devices to test against
├── playwright.config.js
└── package.json
```

## Input files

| File | Purpose |
|------|---------|
| `src/lib.js` | Library with `greet()`, `add()`, `subtract()`, `multiply()`, `divide()` |
| `src/main.html` | Page that imports the library and renders its output |
| `devices.json` | Array of Playwright device names — edit this to add/remove devices |

## Devices

Edit `devices.json` to change the target devices:

```json
["Desktop Chrome", "Desktop Firefox", "iPhone 13", "Pixel 5"]
```

Any name from the [Playwright device list](https://playwright.dev/docs/emulation#devices) can be used.

## Running the tests

```bash
npm install
npx playwright install   # install browsers once
npm test                 # run all tests across all devices
```

The config starts a local static server (via `serve`) automatically before the tests run.
