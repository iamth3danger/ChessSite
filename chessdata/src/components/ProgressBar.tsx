
export type ProgressBarProps = {
  winPercentage: number;
  drawPercentage: number;
  lossPercentage: number;
};



function ProgressBar(props : ProgressBarProps){
    return (
      <div className="w-full bg-gray-200 rounded-full h-3.5 mb-4 dark:bg-gray-700">
        <div className="flex">
          <div
            className="bg-green-500 h-3.5 rounded-l-full"
            style={{ width: `${props.winPercentage}%` }}
          ></div>
          <div
            className="bg-gray-400 h-3.5 "
            style={{ width: `${props.drawPercentage}%` }}
          ></div>
          <div
            className="bg-red-500 h-3.5 rounded-r-full "
            style={{ width: `${props.lossPercentage}%` }}
          ></div>
        </div>
      </div>
    );
};
export default ProgressBar;