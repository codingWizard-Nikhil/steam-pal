from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow the React frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data — replace with real Steam API call once you have a key
MOCK_GAMES = [
    {"appid": 570, "name": "Dota 2", "playtime_forever": 1200},
    {"appid": 730, "name": "CS2", "playtime_forever": 850},
    {"appid": 1172470, "name": "Apex Legends", "playtime_forever": 300},
    {"appid": 271590, "name": "GTA V", "playtime_forever": 450},
    {"appid": 1091500, "name": "Cyberpunk 2077", "playtime_forever": 620},
]

@app.get("/games")
def get_games():
    return {"games": MOCK_GAMES}
