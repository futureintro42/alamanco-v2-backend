const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;
const autoincremental = require("../utils/counter");
const config = require("../config/constants");

const userSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    min: 1,
  },
  first_name: {
    type: String,
    required: true,
    min: 3,
    max: 150,
  },
  last_name: {
    type: String,
    required: true,
    min: 3,
    max: 150,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 150,
  },
  hasPassword: {
    type: String,
    required: true,
  },
  forgotPasswordToken: {
    type: String,
    max: 32,
    defaultValue: "",
  },
  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    defaultValue: "USER",
  },
  profile_pic: {
    type: String,
    defaultValue: ""
  },
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE", "DELETED"],
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

userSchema.pre("validate", function (next) {
  if (this.isNew) {
    autoincremental(model, this, next, config.autoIncrementInitial.userID);
  }
});

userSchema.methods.comparePassword = (password, hasPassword) =>
  bcrypt.compareSync(password, hasPassword);

const model = mongoose.model("User", userSchema);
module.exports = model;
