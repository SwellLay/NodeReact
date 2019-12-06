import mongoose, { Schema } from "mongoose";
import uuidv4 from "uuid/v4";
import formatDate from "./common/date_formatter.middleware";

const schema = mongoose.Schema({
  businessId: {
    type: Schema.Types.ObjectId,
    ref: "organizations",
    required: true
  },
  uuid: {
    type: String,
    default: uuidv4
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "customers",
    required: true
  },
  startDate: {
    type: Date,
    set: formatDate,
    required: true
  },
  endDate: {
    type: Date,
    set: formatDate,
    required: true
  },
  expiryDate: {
    type: Date,
    set: formatDate
  },
  scope: {
    type: String,
    enum: ["paid", "unpaid", "both"],
    required: true
  }


}, {
    timestamps: true
  });

export const StatementModel = mongoose.model("statements", schema);
