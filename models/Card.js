const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const autoincremental = require("../utils/counter");
const config = require("../config/constants");

const cardSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    min: 1,
  },
  fk_user_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    max: 150,
  },
  iqama_number: {
    type: String,
    required: true,
    max: 100,
  },
  issue_date: {
    type: Date,
    default: Date.now(),
  },
  expiry_date: {
    type: Date,
    default: Date.now(),
  },
  certified_as: {
    type: String,
    required: true,
    max: 100,
  },
  company: {
    type: String,
    required: true,
    max: 100,
  },
  examiner: {
    type: String,
    required: true,
    max: 100,
  },
  profile_pic: {
    type: String,
    defaultValue: "",
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

cardSchema.pre("validate", function (next) {
  if (this.isNew) {
    autoincremental(model, this, next, config.autoIncrementInitial.cardID);
  }
});

const model = mongoose.model("Card", cardSchema);
module.exports = model;
