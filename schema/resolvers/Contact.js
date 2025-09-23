const { contact } = require("../../libs");

module.exports = {
    Mutation: {
        createContact: (_, args, context) =>
            new Promise((resolve) =>
                contact.createContact(args?.input, context)
                    .then((response) => resolve(response))
            ),
    },
    Query: {
        contactList: (_, __, context) =>
            new Promise((resolve) =>
                contact.list(context).then((response) => resolve(response))
            ),
    },
};
