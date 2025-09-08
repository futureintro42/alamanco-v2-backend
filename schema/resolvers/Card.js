const { card } = require("../../libs");

module.exports = {
  Mutation: {
    createCard: (_, args, context) =>
      new Promise((resolve) =>
        card
          .createUpdateCard(args?.input, context)
          .then((response) => resolve(response))
      ),
    updateCard: (_, args, context) =>
      new Promise((resolve) =>
        card
          .createUpdateCard(args?.input, context)
          .then((response) => resolve(response))
      ),
      changeCardStatus: (_, args, context) =>
      new Promise((resolve) =>
      card
          .changeStatus(args?.input?.id, context)
          .then((response) => resolve(response))
      ),
      removeCard: (_, args, context) =>
      new Promise((resolve) =>
      card
          .removeCard(args?.input?._id, context)
          .then((response) => resolve(response))
      ),
  },
  Query: {
    findCardById: (_, args) =>
      new Promise((resolve) =>
        card
          .findCardByID(args?.input?._id)
          .then((response) => resolve(response))
      ),
    findCardBySearch: (_, args) =>
      new Promise((resolve) =>
        card
          .findCardBySearch(args?.input?.attribute, args?.input?.value)
          .then((response) => resolve(response))
      ),     
    cardList: (_, __, context) =>
      new Promise((resolve) =>
        card.list(context).then((response) => resolve(response))
      ),
  },
};
