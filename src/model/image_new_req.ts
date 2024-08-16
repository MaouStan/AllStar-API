import { IMAGE_TABLE } from "../config/dbconnect";
import { Subtract } from "utility-types";

// exclude userId, date, and type
export type ImageNewRequest = Subtract<IMAGE_TABLE, {
  id: number;
  score: number;
  imageURL: string;
}>;
