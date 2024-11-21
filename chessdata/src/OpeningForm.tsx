import React, { useState, useEffect } from "react";
import { ChessGameFetcher } from "./classes/ChessGameFetcher";
import { PercentageInfo } from "./classes/PercentageInfo";

function OpeningForm() {
  const [stat, setStat] = useState<PercentageInfo[]>([]);
  const [gameFetcher, setGameFetcher] = useState<ChessGameFetcher>();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  

  async function fetchOpenings() {
    const gameFetcher = new ChessGameFetcher(username);
    // By using await we ensure we don't try to setStat before all the games are fetched
    await gameFetcher.fetchGames();
    const openingStats: PercentageInfo[] = gameFetcher.user_opening_percentages;
    console.log(openingStats);
    setStat(openingStats);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    fetchOpenings();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Enter your name:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      <ul>
        <ul>
            {stat.map((st, index) => (<li key={index}>{st.toString()}</li>))}
        </ul>
      </ul>
    </>
  );
}

export default OpeningForm;
