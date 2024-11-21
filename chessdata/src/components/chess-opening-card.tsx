import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface ChessOpeningCardProps{
  name : string;
  winRate : number;
  drawRate : number;
  lossRate : number;
  averageAccuracy : number;
}

export function ChessOpeningCard({name, winRate, drawRate, lossRate, averageAccuracy} : ChessOpeningCardProps) {
  // const openingStats = {
  //   name: "Caro-Kann Defense",
  //   winRate: 30,
  //   drawRate: 45,
  //   lossRate: 25,
  //   averageAccuracy: 60,
  // }

  return (
    <Card className="w-[20vh] mx-auto bg-black text-white overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg">
      <CardHeader className="p-2">
        <CardTitle className="text-lg font-bold text-center truncate">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex flex-col justify-between flex-grow space-y-3">
        <div className="aspect-square overflow-hidden rounded-md">
          <img
            alt="Chess opening position for Caro-Kann Defense"
            className="object-cover w-full h-full"
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CaroKann-8HBJ7w3ouXncQXDUHhzJKqig1wd78e.png"
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium">
            <span>Win</span>
            <span>Draw</span>
            <span>Loss</span>
          </div>
          <div className="flex h-2 rounded-full overflow-hidden">
            <div
              className="bg-green-500"
              style={{ width: `${winRate}%` }}
            />
            <div
              className="bg-gray-500"
              style={{ width: `${drawRate}%` }}
            />
            <div
              className="bg-red-500"
              style={{ width: `${lossRate}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span>{winRate}%</span>
            <span>{drawRate}%</span>
            <span>{lossRate}%</span>
          </div>
        </div>
      <div className="flex items-center justify-between">
          <span className="text-base font-medium">Avg Accuracy</span>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-700 stroke-current"
                strokeWidth="10"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              ></circle>
              <circle
                className="text-white stroke-current"
                strokeWidth="10"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                strokeDasharray={`${averageAccuracy * 2.51327} 251.327`}
                transform="rotate(-90 50 50)"
              ></circle>
              <text
                x="50"
                y="50"
                fontFamily="Verdana"
                fontSize="20"
                textAnchor="middle"
                alignmentBaseline="central"
                fill="white"
              >{`${averageAccuracy}%`}</text>
            </svg>
          </div>
          </div>
      </CardContent>
    </Card>
  );
}