import mongoose from "mongoose";
const schema = new mongoose.Schema({
  id: String,
  value: Number,
  type: { type: String, enum: ["fixed", "percent"] }
}, { _id: false });

schema.methods.toJSON = function () {
  return {
    id: this.id,
    value: this.value,
    type: this.type
  }
}
export default schema; 
