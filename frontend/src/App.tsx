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
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('http://localhost:8000/games')
      .then(res => res.json())
      .then(data => setGames(data.games))
  }, [])

  const sortedGames = [...games]
    .filter(game => game.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
    if (sortBy === 'most_played') return b.playtime_forever - a.playtime_forever
    if (sortBy === 'least_played') return a.playtime_forever - b.playtime_forever
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="min-h-screen bg-gray-900 text-white px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-1">My Steam Library</h1>
        <p className="text-gray-400 mb-6">{games.length} games</p>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 text-sm focus:outline-none"
          />
          <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortOption)}
          className="bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 text-sm focus:outline-none"
        >
          <option value="most_played">Most Played</option>
          <option value="least_played">Least Played</option>
          <option value="alphabetical">A-Z</option>
        </select>
        </div>

        <div className="flex flex-col gap-3">
          {sortedGames.map(game => (
            <div
              key={game.appid}
              className="flex justify-between items-center bg-gray-800 rounded-lg px-5 py-4 hover:bg-gray-700 transition"
            >
              <span className="font-medium">{game.name}</span>
              <span className="text-gray-400 text-sm">
                {Math.round(game.playtime_forever / 60)} hrs
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
