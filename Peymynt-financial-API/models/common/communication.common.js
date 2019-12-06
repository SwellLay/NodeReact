import { Schema } from "mongoose";

const schema = Schema({
  phone: String,
  fax: String,
  mobile: String,
  tollFree: String,
  website: String
}, { _id: false });

schema.methods.toJSON = function () {
  return {
    phone: this.phone,
    fax: this.fax,
    mobile: this.mobile,
    tollFree: this.tollFree,
    website: this.website,
  }
}


export default schema; 
