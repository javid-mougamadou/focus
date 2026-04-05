# Focus PWA

Focus is a PWA mobile app for single-task focus with a circular timer. Forest-inspired design: create a task, set duration (1–60 min), and track progress. Built with React, TypeScript, Vite, TailwindCSS, and DaisyUI.

## Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

### Google Analytics

Create a `.env` file with your GA4 Measurement ID:

```bash
VITE_GA_MEASUREMENT_ID=G-GM8TH3PZKZ
```

Google Analytics is only enabled in production builds. For GitHub Actions, add `VITE_GA_MEASUREMENT_ID` as a repository secret.

### With Docker

```bash
docker compose up -d
docker compose exec web npm start
```

## Production Build

```bash
npm run build
npm run preview
```

## Quality & Testing

- Lint: `npm run lint`
- Unit tests: `npm run test:ci`

## Features

- Circular timer with pause/play, stop, edit, reset
- LocalStorage persistence (resume after app close)
- Wake Lock API (screen stays on during focus)
- Alarm sound when timer ends
- Light/dark theme

---

## Contact

**Contact :** **Javid Mougamadou** — [Site web](https://javid-mougamadou.pro/) · [GitHub](https://github.com/javid-mougamadou) · [LinkedIn](https://www.linkedin.com/in/mougamadoujavid/) · [Discord](https://discord.gg/8rK6CKGb) · [Email](mailto:javid.mougamadou2@gmail.com)
