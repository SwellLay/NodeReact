import mongoose from "mongoose";
const schema = new mongoose.Schema({
  accountNumber: Number,
  displayName: String,
  routingNumber: String,
  bankName: String,
  accountType: {
    type: String, enum: ["checking", "saving", "current"]
  },
  createdAt: Date,
  updatedAt: Date
}, { _id: false });

schema.methods.toJSON = function () {
  return {
    displayName: this.displayName,
    accountNumber: this.accountNumber,
    routingNumber: this.routingNumber,
    bankName: this.bankName,
    accountType: this.accountType,
    createdAt: this.createdAt
  }
}
export default schema; 
