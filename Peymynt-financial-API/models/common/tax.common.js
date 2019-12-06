import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: String,
  rate: String,
  amount: String,
  id: String
}, { _id: false });

schema.methods.toJSON = function () {
  return {
    name: this.name,
    rate: this.rate,
    amount: this.amount,
    id: this.id
  }
}
export default schema; 
