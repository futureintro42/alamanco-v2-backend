const { mergeTypeDefs } = require("@graphql-tools/merge");

const Common = require("./Common");
const Authentication = require("./Authentication");
const User = require("./User");
const Invoice = require("./Invoice");
const Card = require("./Card");

const types = [Common, Authentication, User, Invoice, Card];

module.exports = mergeTypeDefs(types);
