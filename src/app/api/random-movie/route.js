import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get("genre");

    const response = await axios.get("https://api.trakt.tv/movies/trending", {
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": process.env.TRAKT_CLIENT_ID,
      },
    });

    let movies = response.data.map((item) => item.movie);

    // Filter by genre correctly
    if (genre) {
      movies = movies.filter((m) =>
        m.genres?.map((g) => g.toLowerCase()).includes(genre.toLowerCase())
      );
    }

    if (movies.length === 0) {
      return new Response(
        JSON.stringify({ error: "No movies found for this genre" }),
        { status: 404 }
      );
    }

    const randomMovie = movies[Math.floor(Math.random() * movies.length)];

    // Fetch OMDb data
    const omdbRes = await axios.get(
      `https://www.omdbapi.com/?t=${encodeURIComponent(randomMovie.title)}&y=${randomMovie.year}&apikey=${process.env.OMDB_API_KEY}`
    );

    const movieDetails = {
      ...randomMovie,
      poster: omdbRes.data.Poster,
      plot: omdbRes.data.Plot,
    };

    return new Response(JSON.stringify(movieDetails), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch movie" }), {
      status: 500,
    });
  }
}
