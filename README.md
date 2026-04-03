# kit-playwright

Playwright boilerplate for testing JSON-driven timeline scenarios against a black-page DOM.

## Running

```bash
pnpm i
npx playwright install   # first time only
```

```bash
pnpm test # runs all scenarios across all devices
pnpm test-ui
```

The config auto-starts a local static server on port 3000.

## Devices

Edit `devices.json` to change target devices. Any name from the [Playwright device list](https://playwright.dev/docs/emulation#devices) works.

```json
["Desktop Chrome", "Desktop Firefox", "iPhone 13", "Pixel 5"]
```

## Project structure

```
kit-playwright/
├── src/
│   └── main.html          # Full-screen black page with a centered #stage div
├── scenarios/
│   └── example.json       # Example timeline scenario
├── tests/
│   └── timeline.spec.js   # Auto-discovers and runs all scenarios
├── devices.json           # Target devices
└── playwright.config.js
```

## How it works

1. Drop `.json` files into `scenarios/`. Each file is a timeline: an array of events sorted by `milliseconds`.
2. `timeline.spec.js` generates one test per file, replays the events in real-time, and asserts the DOM reacted.
3. `main.html` listens for `kit:message` custom events and exposes `data-last-type` / `data-last-json` on `#stage` for assertions. Add your own DOM handlers there.

## Scenario format

```json
[
  { "milliseconds": 0, "type": "show", "json": "{\"text\": \"Hello\"}" },
  { "milliseconds": 500, "type": "update", "json": "{\"text\": \"World\"}" },
  { "milliseconds": 1000, "type": "hide", "json": "{}" }
]
```

| Field          | Type   | Description                                 |
| -------------- | ------ | ------------------------------------------- |
| `milliseconds` | number | When the event fires relative to test start |
| `type`         | string | Event type, matched in `main.html` handlers |
| `json`         | string | Payload, JSON-encoded string                |
