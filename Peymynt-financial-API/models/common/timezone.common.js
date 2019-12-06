import mongoose from "mongoose";
const schema = new mongoose.Schema({
  timeZoneName: String,
  displayName: String,
  offset: String,
  isoName: String,
  timeZoneShortName: String
});

schema.methods.toJSON = function () {
  return {
    displayName: this.displayName,
    offset: this.offset,
    timeZoneShortName: this.timeZoneShortName,
  }
}
export default schema; 
