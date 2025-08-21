const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const autoincremental = require("../utils/counter");
const config = require("../config/constants");

const invoiceSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    min: 1,
  },
  fk_user_id: {
    type: Number,
    required: true,
  },
  sticker_number: {
    type: String,
    required: true,
    max: 30,
  },
  reference_number: {
    type: String,
    required: true,
    max: 30,
  },
  equipment_type: {
    type: String,
    required: true,
    max: 30,
  },
  equipment_description: {
    type: String,
    required: true,
    max: 200,
  },
  make: {
    type: String,
    required: true,
    max: 150,
  },
  serial_number: {
    type: String,
    required: true,
    max: 100,
  },
  year_of_manufacturing: {
    type: String,
    required: true,
    max: 30,
  },
  plant_number: {
    type: String,
    required: true,
    max: 100,
  },
  location_of_equipment: {
    type: String,
    required: true,
    max: 30,
  },
  owner_business_name: {
    type: String,
    required: true,
    max: 150,
  },
  owner_business_address: {
    type: String,
    required: true,
    max: 200,
  },
  details: {
    type: String,
    required: true,
    max: 200,
  },
  standard_specification: {
    type: String,
    required: true,
    max: 200,
  },
  business_name: {
    type: String,
    required: true,
    max: 100,
  },
  business_address: {
    type: String,
    required: true,
    max: 200,
  },
  inspection_date: {
    type: Date,
    default: Date.now(),
  },
  inspection_next_date: {
    type: Date,
    default: Date.now(),
  },
  inspector_name: {
    type: String,
    required: true,
    max: 100,
  },
  createdBy: {
    type: Number,
    required: true,
  },
  updatedBy: {
    type: Number,
    required: true,
  },
  resultStatus: {
    type: String,
    required: true,
    max: 50,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    defaultValue: "INACTIVE",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updateddAt: {
    type: Date,
    default: Date.now(),
  },
});

invoiceSchema.pre("validate", function (next) {
  if (this.isNew) {
    autoincremental(model, this, next, config.autoIncrementInitial.certificateID);
  }
});

const model = mongoose.model("Invoice", invoiceSchema);
module.exports = model;
