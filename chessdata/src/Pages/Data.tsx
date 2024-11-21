import React from "react";
import Header from "../components/Header";
import SubmissionForm from "../components/SubmissionForm";
import { FormInfo } from "../classes/FormInfo";
import { useState, useEffect } from "react";
import { ChessGameFetcher } from "../classes/ChessGameFetcher";
import { PercentageInfo } from "../classes/PercentageInfo";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import StatCard from "../components/StatCard";
import { ChessOpeningCard } from "../components/chess-opening-card";
import GraphComponent from "../components/GraphComponent";

function Data() {
  const data = [
    { week: 1, winPercentage: 50 },
    { week: 2, winPercentage: 55 },
    { week: 3, winPercentage: 60 },
    { week: 4, winPercentage: 58 },
    { week: 5, winPercentage: 65 },
    { week: 1, winPercentage: 50 },
    { week: 2, winPercentage: 55 },
    { week: 3, winPercentage: 60 },
    { week: 4, winPercentage: 58 },
    { week: 5, winPercentage: 65 },
    { week: 1, winPercentage: 50 },
    { week: 2, winPercentage: 55 },
    { week: 3, winPercentage: 60 },
    { week: 4, winPercentage: 58 },
    { week: 5, winPercentage: 65 },
    { week: 1, winPercentage: 50 },
    { week: 2, winPercentage: 55 },
    { week: 3, winPercentage: 60 },
    { week: 4, winPercentage: 58 },
    { week: 5, winPercentage: 65 },
  ];

  const [stat, setStat] = useState<PercentageInfo[]>([
    new PercentageInfo("opening", 0, 10, 75, 1 - 5),
    new PercentageInfo("opening", 0, 20, 77, 3),
    new PercentageInfo("opening", 0, 30, 63, 7),
    new PercentageInfo("opening", 0, 40, 49, 11),
    new PercentageInfo("opening", 0, 10, 75, 1 - 5),
    new PercentageInfo("opening", 0, 20, 77, 3),
    new PercentageInfo("opening", 0, 30, 63, 7),
    new PercentageInfo("opening", 0, 40, 49, 11)
  ]);
  const [gameFetcher, setGameFetcher] = useState<ChessGameFetcher>();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [account, setAccount] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isSubmittable, setSubmittable] = useState(false);

  const form: FormInfo = {
    account: account,
    startDate: startDate,
    endDate: endDate,
    isSubmittable: isSubmittable,
    setAccount: setAccount,
    setStartDate: setStartDate,
    setEndDate: setEndDate,
    setSubmittable: setSubmittable,
  };

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
    <div>
      {/* <div className="justify-between">
        <table className="table-auto w-full border-gray-300">
          <tr className="border border-gray-300 px-4 py-2 text-gray-400 text-sm font-bold bg-gray-100">
            <th className="">Opening</th>
            <th className="">Win Percentage</th>
            <th className="">Games Played</th>
          </tr>
          {stat.map((st, index) => (
            <tr className="border border-gray-300 px-4 py-2">
              <th className="">{st.opening}</th>
              <th className="">
                <div className="w-full bg-gray-200 rounded-full h-3.5 mb-4 dark:bg-gray-700">
                  <div className="flex">
                    <div
                      className="bg-blue-600 h-3.5 rounded-l-full dark:bg-green-500"
                      style={{ width: `${st.winPercentage}%` }}
                    ></div>
                    <div
                      className="bg-blue-600 h-3.5 dark:bg-gray-500"
                      style={{ width: `${st.drawPercentage}%` }}
                    ></div>
                    <div
                      className="bg-blue-600 h-3.5 rounded-r-full dark:bg-red-500"
                      style={{ width: `${st.lossPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </th>
              <th className="">{st.totalGames}</th>
            </tr>
          ))}
        </table> */}
      <div className="min-h-screen bg-[#1a2b3c]">
        <Header />
        <div className="lg:flex">
          <div className="mt-10">
          <GraphComponent data={data} />
          </div>
          <div className="container m-auto grid lg:grid-cols-6 md:grid-cols-4 pt-5">
            {stat.map((st, index) => (
              <ChessOpeningCard
                name={st.opening}
                winRate={st.winPercentage}
                drawRate={st.drawPercentage}
                lossRate={st.lossPercentage}
                averageAccuracy={60}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Data;