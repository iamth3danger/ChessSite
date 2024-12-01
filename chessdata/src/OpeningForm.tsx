import React, { useState, useEffect } from "react";
import { ChessGameFetcher } from "./classes/ChessGameFetcher";
import { PercentageInfo } from "./classes/PercentageInfo";
import { ChessGameProcessor } from "./classes/ChessGameProcessor";
import { OpeningResults } from "./classes/OpeningResults";
import { Opening } from "./classes/Opening"

function OpeningForm() {
  const [opening, setOpenings] = useState<Opening[]>([]);
  const [gameFetcher, setGameFetcher] = useState<ChessGameFetcher>();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  

  async function fetchOpenings() {
     const gameFetcher = new ChessGameFetcher(username, "2024", "08", "2024", "11");
     await gameFetcher.fetchGameArchives();
     let gameProcessor = new ChessGameProcessor(gameFetcher.logOpenings());
     gameProcessor.init();

     const openingResults: OpeningResults = gameProcessor.getResults();
     const openings: Opening[] = openingResults.getOpenings();
     for (var opening of openings) console.log(opening.getOpeningName());
     setOpenings(openings);
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
            {opening.map((op, index) => (<li key={index}>{op.toString()}</li>))}
        </ul>
      </ul>
    </>
  );
}

export default OpeningForm;
