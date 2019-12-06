import mongoose, { Schema } from "mongoose";
import uuidv4 from "uuid/v4";

const schema = mongoose.Schema({
  organizationName: {
    type: String,
    required: true
  },
  organizationType: {
    type: String,
    required: true
  },
  businessType: {
    type: String,
    required: true
  },
  businessSubType: {
    type: String,
    required: true
  },
  uuid: {
    type: String,
    default: uuidv4
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  address: {
    country: {
      id: Number,
      name: String,
      sortname: String
    },
    state: {
      id: String,
      name: String,
      country_id: String
    },
    city: String,
    postal: Number,
    addressLine1: String,
    addressLine2: String
  },
  communication: {
    phone: String,
    fax: String,
    mobile: String,
    tollFree: String,
    website: String
  },
  timezone: {
    name: String,
    offSet: Number,
    zoneAbbr: String
  },
  country: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  currency: {
    code: String,
    name: String,
    symbol: String,
    displayName: String
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: "users",
    addedOn: Date,
    lastSeen: Date
  }],
  securityCheck: {
    isClosed: {
      type: Boolean,
      default: false
    },
    isBlocked: {
      type: Boolean,
      default: false
    }
  },
  meta: Object,
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    required: false
  }
}, {
    timestamps: true
  });

schema.virtual("setting", {
  ref: 'sales_setting',
  localField: '_id',
  foreignField: 'businessId',
  justOne: true
});

schema.methods.toUserJson = function () {
  let data = {
    organizationName: this.organizationName,
    organizationType: this.organizationType,
    businessType: this.businessType,
    businessSubType: this.businessSubType,
    uuid: this.uuid,
    address: this.address,
    communication: this.communication,
    timezone: this.timezone,
    country: this.country,
    currency: this.currency,
    isPrimary: this.isPrimary,
    meta: this.meta
  };
  if (this.setting) {
    data.setting = {
      displayLogo: this.setting.displayLogo,
      companyLogo: this.setting.companyLogo,
      accentColour: this.setting.accentColour,
      template: this.setting.template
    };
  }
  return data;
};
export const OrganizationModel = mongoose.model("organizations", schema);
