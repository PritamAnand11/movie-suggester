import { useState } from "react";

export default function Home() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMovie = async () => {
    setLoading(true);
    const res = await fetch("/api/random-movie");
    const data = await res.json();
    setMovie(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">🎬 Movie Suggestion App</h1>

      <button
        onClick={fetchMovie}
        className="px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700 transition"
      >
        Suggest a Movie
      </button>

      {loading && <p className="mt-4">Loading...</p>}

      {movie && (
        <div className="mt-6 p-6 bg-gray-800 rounded-xl shadow-lg w-96 text-center">
          <h2 className="text-2xl font-semibold">{movie.title}</h2>
          <p className="text-gray-400 mt-2">Year: {movie.year}</p>
          <p className="mt-4 text-sm text-gray-300">
            Trakt Slug: <span className="text-red-400">{movie.ids.slug}</span>
          </p>
        </div>
      )}
    </div>
  );
}
