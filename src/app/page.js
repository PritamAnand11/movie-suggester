"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch from Supabase
  useEffect(() => {
    fetchFavorites();
    fetchComments();

    // Real-time updates
    const commentsSub = supabase
      .channel("public:comments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        fetchComments
      )
      .subscribe();

    const favoritesSub = supabase
      .channel("public:favorites")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "favorites" },
        fetchFavorites
      )
      .subscribe();

    return () => {
      supabase.removeChannel(commentsSub);
      supabase.removeChannel(favoritesSub);
    };
  }, []);

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });
    setComments(data || []);
  };

  const fetchFavorites = async () => {
    const { data } = await supabase
      .from("favorites")
      .select("*")
      .order("created_at", { ascending: false });
    setFavorites(data || []);
  };

  const fetchMovie = async () => {
    setLoading(true);
    const res = await fetch(`/api/random-movie?genre=${genre}`);
    const data = await res.json();
    setMovie(data);
    setLoading(false);
  };

  const addFavorite = async () => {
    if (!movie) return;
    await supabase
      .from("favorites")
      .insert([{ title: movie.title, year: movie.year }]);
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    await supabase.from("comments").insert([{ text: newComment.trim() }]);
    setNewComment("");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
    

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-6 text-white p-6">
        <h1 className="text-6xl font-extrabold text-center mb-4">
          Stream Flick🎬
        </h1>

        {/* Genre filter */}
        <select
          className="mb-4 p-3 rounded bg-gray-900 text-white border border-green-600"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">Any Genre</option>
          <option value="action">Action</option>
          <option value="comedy">Comedy</option>
          <option value="horror">Horror</option>
          <option value="drama">Drama</option>
        </select>

        {/* Suggest Movie Button */}
        {/* Suggest Movie Button */}
<button
  onClick={fetchMovie}
  className="btn-hulk px-8 py-3 bg-green-600 rounded-xl font-bold text-lg"
>
  Suggest a Movie
</button>

{loading && (
  <div className="mt-6 flex flex-col items-center">
    <img 
      src="https://i.imgur.com/cbxw10m.gif"   // replace with your gif path
      alt="Loading Hulk"
      className="w-25 h-25 mb-2" 
    />
    <span className="text-lg font-semibold text-white">
      Smashing a movie for you
    </span>
  </div>
)}


        {/* Movie Card */}
        {movie && (
          <div className="card-hover mt-6 p-6 bg-gray-900 bg-opacity-80 rounded-xl shadow-2xl w-full flex flex-col items-center text-center transition">
            {movie.poster && (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-72 rounded-lg mb-4 shadow-lg"
              />
            )}
            <h2 className="text-3xl font-bold">{movie.title}</h2>
            <p className="text-gray-300 mt-3">Year: {movie.year}</p>
            <p className="mt-4 text-gray-200">{movie.plot}</p>
            <button
              onClick={addFavorite}
              className="btn-hulk mt-4 px-5 py-2 bg-green-700 rounded font-semibold"
            >
            Add to Favorites ❤️
            </button>
          </div>
        )}

        {/* Favorites */}
        {favorites.length > 0 && (
          <div className="mt-10 w-full">
            <h3 className="text-3xl font-bold mb-4 glow-green">⭐ Favorites</h3>
            <ul className="space-y-2">
              {favorites.map((f) => (
                <li
                  key={f.id}
                  className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                >
                  {f.title} ({f.year})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Comments */}
        <div className="mt-10 w-full">
          <h3 className="text-3xl font-bold mb-4">Comments💬</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 p-3 rounded bg-gray-900 border border-green-600 text-white"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={addComment}
              className="btn-hulk px-6 py-2 bg-green-600 rounded font-semibold"
            >
              Post
            </button>
          </div>
          <ul className="space-y-2">
            {comments.map((c) => (
              <li
                key={c.id}
                className="p-3 bg-gray-800 rounded hover:bg-gray-700 transition"
              >
                {c.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
