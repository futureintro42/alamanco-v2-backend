const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const autoincremental = require("../utils/counter");

const contactSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    min: 1,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

contactSchema.pre("validate", function (next) {
  if (this.isNew) {
    autoincremental(model, this, next, 1);
  }
});

const model = mongoose.model("Contact", contactSchema);
module.exports = model;
