import { Document } from "mongoose";

export interface IFlowchart extends Document {
  _id: string;
  imageUrl: string;
  flowchartData: string;
  createdAt: Date;
  updatedAt: Date;
}
