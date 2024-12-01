import React from "react";
import Header from "../components/Header";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

function Analysis() {
  return (
    <div className="flex flex-col overflow-x-hidden bg-black">
      <Header />
      <div className="container flex flex-wrap justify-center my-8 xl:max-h-[80vh] border-2">
        <div className="">
          <Chessboard id="BasicBoard" boardWidth={window.innerWidth * 0.35} />
        </div>
      </div>
    </div>
  );
}

export default Analysis;
