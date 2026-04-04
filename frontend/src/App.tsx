import { useState, useEffect } from 'react'

interface Game {
  appid: number
  name: string
  playtime_forever: number
}

type SortOption = 'most_played' | 'least_played' | 'alphabetical'

function App() {
  const [games, setGames] = useState<Game[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('most_played')

  useEffect(() => {
    fetch('http://localhost:8000/games')
      .then(res => res.json())
      .then(data => setGames(data.games))
  }, [])

  const sortedGames = [...games].sort((a, b) => {
    if (sortBy === 'most_played') return b.playtime_forever - a.playtime_forever
    if (sortBy === 'least_played') return a.playtime_forever - b.playtime_forever
    return a.name.localeCompare(b.name)
  })

  return (
    <div>
      <h1>My Steam Library</h1>
      <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)}>
        <option value="most_played">Most Played</option>
        <option value="least_played">Least Played</option>
        <option value="alphabetical">A-Z</option>
      </select>
      <p>{games.length} games</p>
      <ul>
        {sortedGames.map(game => (
          <li key={game.appid}>
            {game.name} — {Math.round(game.playtime_forever / 60)} hrs
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
