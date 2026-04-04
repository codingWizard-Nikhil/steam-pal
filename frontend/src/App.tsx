import { useState, useEffect } from 'react'

interface Game {
  appid: number
  name: string
  playtime_forever: number
}

function App() {
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    fetch('http://localhost:8000/games')
      .then(res => res.json())
      .then(data => setGames(data.games))
  }, [])

  return (
    <div>
      <h1>My Steam Library</h1>
      <p>{games.length} games</p>
      <ul>
        {games.map(game => (
          <li key={game.appid}>
            {game.name} — {Math.round(game.playtime_forever / 60)} hrs
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
