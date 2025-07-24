import { IFlowchart } from "../interfaces/IFlowchart.js";
import mongoose, { Model, Schema } from "mongoose";

const flowchartSchema: Schema<IFlowchart> = new Schema(
  {
    imageUrl: { type: String, required: true },
    flowchartData: { type: String, required: true },
  },
  { timestamps: true }
);

const Flowchart: Model<IFlowchart> = mongoose.model<IFlowchart>(
  "flowchart",
  flowchartSchema
);

export default Flowchart;
