# Who Wants to be a Millionaire (WWTBAM) Quiz App

A web-based quiz application inspired by the game show "Who Wants to be a Millionaire", built with Flask and JavaScript. The app supports question management, auto-generation of questions using Gemini AI, and is installable as a Progressive Web App (PWA).

## Features

- Add, edit, and delete quiz questions and options
- Auto-generate questions using Gemini AI (Google Generative Language API)
- Multiple game settings: timer, number of questions, two-player mode, scoreboard, and more
- Audio effects and music for immersive gameplay
- PWA support: installable on desktop and mobile, offline support via service worker
- Responsive UI with Bootstrap 5

## Project Structure

```
.
├── app.py
├── requirements.txt
├── .env
├── .gitignore
├── static/
│   ├── manifest.json
│   ├── sw.js
│   ├── script/
│   │   ├── index.js
│   │   ├── settings.js
│   │   └── game.js
│   ├── audio/
│   ├── favicon_io/
│   └── img/
└── templates/
    ├── index.html
    ├── settings.html
    └── game.html
```

## Setup

1. **Clone the repository**

   ```sh
   git clone <your-repo-url>
   cd wwtbam2.0
   ```

2. **Install dependencies**

   ```sh
   pip install -r requirements.txt
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with your Gemini API key:

   ```
   gemini_api_key=YOUR_GEMINI_API_KEY
   ```

4. **Run the Flask app**

   ```sh
   python app.py
   ```

5. **Access the app**

   Open [http://localhost:5000](http://localhost:5000) in your browser.

## PWA Installation

- The app is a Progressive Web App. You can "Install" it from your browser for offline access.
- Service worker and manifest are configured for offline support and home screen installation.

## Customization

- **Audio & Images:** Place your own audio files in `static/audio/` and images in `static/img/`.
- **Icons:** Update icons in `static/favicon_io/` and `static/manifest.json` as needed.

## License

This project is for educational purposes.

---

**Enjoy your Millionaire Quiz Game!**