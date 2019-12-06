import mongoose, { Schema } from "mongoose";
import uuidv4 from "uuid/v4";
import TimeZoneModel from "./common/timezone.common";
import AddressModel from "./common/address.common";
import CommunicationModel from "./common/communication.common";
import formatDate from "./common/date_formatter.middleware";

const schema = mongoose.Schema({
  businessId: {
    type: Schema.Types.ObjectId,
    ref: "organizations",
    required: true,
    unique: true
  },
  businessType: {
    type: String,
    enum: ["sole_proprietorship", "single_member_llc", "multiple_member_llc", "corporation", "partnership", "non_profit"]
  },
  country: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  telephone: String,
  ein: String,
  website: String,
  organizationAge: Number,
  positionInOrganization: String,
  businessCategory: {
    type: String
  },
  uuid: {
    type: String,
    default: uuidv4
  },
  donationVia: {
    type: String,
    enum: ['email', 'events', 'website']
  },
  signingAuthorityName: String,
  tradeName: String,
  address: AddressModel,
  legalName: String,
  sellType: {
    type: String,
    enum: ["Product", "Service", "Both"]
  },
  description: String,
  taxId: String,
  hasAcceptedCreditCardInPast: Boolean,
  owners: [{
    firstName: String,
    lastName: String,
    ownership: Number,
    address: AddressModel,
    communication: CommunicationModel,
    dob: { type: Date, set: formatDate },
    govtId: {
      value: String,
      idType: {
        type: String,
        enum: ["SSN", "PASSPORT"]
      }
    }
  }],

  account: {
    integrationType: {
      type: String,
      enum: ["Manual", "Plaid"],
      default: "Manual"
    },
    accountName: String,
    accountType: String,
    routingNumber: String,
    accountNumber: String,
    bankName: String
  },

  isConnected: {
    type: Boolean,
    default: false
  },

  statement: {
    displayName: {
      type: String, default: "PEYMYNT"
    }
  },

  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    remarks: String,
    firstVerifiedOn: { type: Date, default: null },
    lastVerifiedOn: { type: Date, default: null }
  },

  tosAcceptance: {
    date: Number,
    ip: String,
    userAgent: String
  },

  stripe: Object

}, {
  timestamps: true
});

schema.methods.toUserJson = function () {
  let data = {
    businessId: this.businessId,
    businessCategory: this.businessCategory,
    businessType: this.businessType,
    address: this.address,
    country: this.country,
    currency: this.currency,
    legalName: this.legalName,
    sellType: this.sellType,
    description: this.description,
    website: this.website,
    telephone: this.telephone,
    ein: this.ein,
    taxId: this.taxId,
    hasAcceptedCreditCardInPast: this.hasAcceptedCreditCardInPast,
    owners: this.owners,
    account: this.account,
    statement: this.statement,
    isConnected: this.isConnected,
    donationVia: this.donationVia,
    signingAuthorityName: this.signingAuthorityName,
    tradeName: this.tradeName,
    organizationAge: this.organizationAge,
    positionInOrganization: this.positionInOrganization
  }
  if (this.stripe)
    data.stripe = {
      id: this.stripe.id,
      verification: this.stripe.verification,
      payoutSchedule: this.stripe.payout_schedule,
      payoutsEnabled: this.stripe.payouts_enabled
    }
  return data;
}

schema.methods.toStripeJson = function () {
  return {
    country: this.country,
    type: "custom",
    external_account: {
      object: "bank_account",
      country: this.country,
      currency: this.currency,
      routing_number: this.account.routingNumber,
      account_number: this.account.accountNumber,
    },
    legal_entity: {},
    tos_acceptance: {
      date: this.tosAcceptance.date,
      ip: this.tosAcceptance.ip,
      user_agent: this.tosAcceptance.userAgent
    }
  }
}

export const LegalModel = mongoose.model("legals", schema);
