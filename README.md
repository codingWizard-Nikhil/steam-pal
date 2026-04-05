# SteamPal

A full-stack web app that connects to your Steam account and gives you a clean, searchable view of your game library.

Built with React, TypeScript, Python, FastAPI, and PostgreSQL.

---

## Features

- Displays your full Steam game library with playtime
- Sort by most played, least played, or alphabetically
- Real-time search to find any game instantly
- Favorite games with a star and filter to favorites view
- Dark theme designed to match the Steam aesthetic

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI |
| Database | PostgreSQL, SQLAlchemy |
| Data | Steam Web API |

---

## Getting Started

### Prerequisites

- Node.js
- Python 3.x
- PostgreSQL
- A Steam account with a [Steam Web API key](https://steamcommunity.com/dev/apikey)

### 1. Clone the repo

```bash
git clone https://github.com/codingWizard-Nikhil/steam-pal.git
cd steam-pal
```

### 2. Create the database

```bash
createdb steampal
```

### 3. Set up the backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:

```
STEAM_API_KEY=your_api_key_here
STEAM_ID=your_steam_id_here
DATABASE_URL=postgresql://localhost/steampal
```

Start the backend:

```bash
uvicorn main:app --reload
```

### 4. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Open the app

Go to [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
steam-pal/
├── backend/
│   ├── main.py          # FastAPI app, Steam API integration, and favorites endpoints
│   ├── requirements.txt
│   └── .env             # API keys (not committed)
└── frontend/
    ├── src/
    │   ├── App.tsx      # Main React component
    │   └── index.css    # Tailwind CSS
    └── package.json
```

---

## How It Works

The React frontend runs in the browser and sends requests to the FastAPI backend. The backend uses your Steam API key to fetch your library from Steam's servers and returns it as JSON. Favorites are stored in a PostgreSQL database — starring a game calls the backend which persists it so your favorites survive page refreshes.

Your API key never touches the frontend — it stays securely on the backend.
