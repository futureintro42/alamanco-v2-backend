const { mergeResolvers } = require("@graphql-tools/merge");

const authentication = require("./Authentication");
const user = require("./User");
const invoice = require("./Invoice");
const card = require("./Card");
const contact = require("./Contact");

const resolvers = [authentication, user, invoice, card, contact];

module.exports = mergeResolvers(resolvers);
