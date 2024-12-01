import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tooltip,
} from "@material-tailwind/react";
import caro from "./../assets/Images/CaroKann.png";
import { PercentageInfo } from "../classes/PercentageInfo";
import ProgressBar from "../components/ProgressBar";

type EventCapture = {
  placeholder?: unknown;
  onPointerEnterCapture?: unknown;
  onPointerLeaveCapture?: unknown;
};

declare module "@material-tailwind/react" {
  export interface CardProps extends EventCapture {
    placeholder?: unknown;
  }
  export interface CardBodyProps extends EventCapture {}
  export interface CardFooterProps extends EventCapture {}
  export interface TypographyProps extends EventCapture {}
  export interface ButtonProps extends EventCapture {}
  export interface CardHeaderProps extends EventCapture {}
}

function StatCard(props : PercentageInfo) {
  return (
    <Card className="w-64 h-72 bg-light-lion">
      <CardHeader floated={true} className="w-36 top-12 left-10 border-solid">
        <img src={caro} alt="profile-picture" className="border-solid" />
      </CardHeader>
      <CardBody className="text-center">
        <Typography variant="h4" color="blue-gray" className="mt-8">
          ""
        </Typography>

        <div className="flex justify-between">
          <text className="text-green-500">Win</text>
          <text className="text-gray-400">Draw</text>
          <text className="text-red-500">Loss</text>
        </div>

        <ProgressBar
          winPercentage={props.getWin()}
          lossPercentage={props.getLoss()}
          drawPercentage={props.getDraw()}
        />
      </CardBody>
    </Card>
  );
}

export default StatCard;
