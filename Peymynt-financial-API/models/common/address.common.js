import mongoose, { Schema } from "mongoose";

const schema = new Schema({
  country: {
    id: Number,
    name: String,
    sortname: String,
    shortName: String
  },
  state: {
    id: String,
    name: String,
    country_id: String,
    countryId: Number
  },
  city: String,
  postal: String,
  addressLine1: String,
  addressLine2: String
}, { _id: false });

schema.methods.toJSON = function () {
  return {
    country: this.country,
    state: this.state,
    city: this.city,
    postal: this.postal,
    addressLine1: this.addressLine1,
    addressLine2: this.addressLine2,
  };
};

export default schema; 
