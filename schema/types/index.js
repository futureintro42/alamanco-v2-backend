const { mergeTypeDefs } = require("@graphql-tools/merge");

const Common = require("./Common");
const Authentication = require("./Authentication");
const User = require("./User");
const Invoice = require("./Invoice");
const Card = require("./Card");
const Contact = require("./Contact");

const types = [Common, Authentication, User, Invoice, Card, Contact];

module.exports = mergeTypeDefs(types);
