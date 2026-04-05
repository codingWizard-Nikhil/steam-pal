import { useState, useEffect } from 'react'

interface Game {
  appid: number
  name: string
  playtime_forever: number
}

type SortOption = 'most_played' | 'least_played' | 'alphabetical' | 'favorites'

function App() {
  const [games, setGames] = useState<Game[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('most_played')
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetch('http://localhost:8000/games')
      .then(res => res.json())
      .then(data => setGames(data.games))

    fetch('http://localhost:8000/favorites')
      .then(res => res.json())
      .then(data => setFavorites(new Set(data.favorites)))
  }, [])

  const toggleFavorite = (appid: number) => {
    const isFavorited = favorites.has(appid)
    const method = isFavorited ? 'DELETE' : 'POST'

    fetch(`http://localhost:8000/favorites/${appid}`, { method })
      .then(() => {
        setFavorites(prev => {
          const next = new Set(prev)
          if (isFavorited) {
            next.delete(appid)
          } else {
            next.add(appid)
          }
          return next
        })
      })
  }

  const visibleGames = [...games]
    .filter(game => {
      if (sortBy === 'favorites') return favorites.has(game.appid)
      return game.name.toLowerCase().includes(search.toLowerCase())
    })
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
            disabled={sortBy === 'favorites'}
            className="flex-1 bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 text-sm focus:outline-none disabled:opacity-40"
          />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className="bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 text-sm focus:outline-none"
          >
            <option value="most_played">Most Played</option>
            <option value="least_played">Least Played</option>
            <option value="alphabetical">A-Z</option>
            <option value="favorites">Favorites</option>
          </select>
        </div>

        <div className="flex flex-col gap-3">
          {visibleGames.map(game => (
            <div
              key={game.appid}
              className="flex justify-between items-center bg-gray-800 rounded-lg px-5 py-4 hover:bg-gray-700 transition"
            >
              <span className="font-medium">{game.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">
                  {Math.round(game.playtime_forever / 60)} hrs
                </span>
                <button
                  onClick={() => toggleFavorite(game.appid)}
                  className="text-xl leading-none focus:outline-none"
                >
                  {favorites.has(game.appid) ? '★' : '☆'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
