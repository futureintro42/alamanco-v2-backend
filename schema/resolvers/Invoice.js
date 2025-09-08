const { invoice } = require("../../libs");

module.exports = {
  Mutation: {
    createInvoice: (_, args, context) =>
      new Promise((resolve) =>
        invoice
          .createUpdateInvoice(args?.input, context)
          .then((response) => resolve(response))
      ),
    updateInvoice: (_, args, context) =>
      new Promise((resolve) =>
        invoice
          .createUpdateInvoice(args?.input, context)
          .then((response) => resolve(response))
      ),
      changeInvoiceStatus: (_, args, context) =>
      new Promise((resolve) =>
      invoice
          .changeStatus(args?.input?.id, context)
          .then((response) => resolve(response))
      ),
      removeInvoice: (_, args, context) =>
      new Promise((resolve) =>
      invoice
          .removeInvoice(args?.input?._id, context)
          .then((response) => resolve(response))
      ),
  },
  Query: {
    findInvoiceByID: (_, args) =>
      new Promise((resolve) =>
        invoice
          .findByID(args?.input?._id)
          .then((response) => resolve(response))
      ),
    findInvoiceBySearch: (_, args) =>
      new Promise((resolve) =>
        invoice
          .findInvoiceBySearch(args?.input?.attribute, args?.input?.value)
          .then((response) => resolve(response))
      ),
    invoiceList: (_, __, context) =>
      new Promise((resolve) =>
        invoice.list(context).then((response) => resolve(response))
      ),
  },
};
