import os
import requests
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer
from sqlalchemy.orm import DeclarativeBase, Session

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

STEAM_API_KEY = os.getenv("STEAM_API_KEY")
STEAM_ID = os.getenv("STEAM_ID")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/steampal")

engine = create_engine(DATABASE_URL)

class Base(DeclarativeBase):
    pass

class Favorite(Base):
    __tablename__ = "favorites"
    appid = Column(Integer, primary_key=True)

Base.metadata.create_all(engine)

def get_db():
    with Session(engine) as db:
        yield db

@app.get("/games")
def get_games():
    url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/"
    params = {
        "key": STEAM_API_KEY,
        "steamid": STEAM_ID,
        "include_appinfo": True,
        "format": "json"
    }
    response = requests.get(url, params=params)
    data = response.json()
    games = data.get("response", {}).get("games", [])
    return {"games": games}

@app.get("/favorites")
def get_favorites(db: Session = Depends(get_db)):
    favorites = db.query(Favorite).all()
    return {"favorites": [f.appid for f in favorites]}

@app.post("/favorites/{appid}")
def add_favorite(appid: int, db: Session = Depends(get_db)):
    if db.get(Favorite, appid):
        return {"ok": True}
    db.add(Favorite(appid=appid))
    db.commit()
    return {"ok": True}

@app.delete("/favorites/{appid}")
def remove_favorite(appid: int, db: Session = Depends(get_db)):
    favorite = db.get(Favorite, appid)
    if favorite:
        db.delete(favorite)
        db.commit()
    return {"ok": True}
