import mongoose, { Schema } from "mongoose";

const schema = new Schema({
  code: String,
  name: String,
  displayName: String,
  symbol: String
}, { _id: false });

schema.methods.toJSON = function () {
  return {
    code: this.code,
    name: this.name,
    symbol: this.symbol,
    displayName: this.displayName
  };
};

export default schema; 
