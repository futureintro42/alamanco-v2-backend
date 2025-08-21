const joi = require("../validation/user");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
  findByAttribute(condition, modal) {
    return new Promise((resolve) =>
      modal
        .findOne(condition)
        .then((data) => resolve({ error: null, data }))
        .catch((error) => resolve({ error, data: null }))
    );
  },
  updateByAttributes(condition, valueObj, modal) {
    return new Promise((resolve) =>
      modal
        .updateOne(condition, { $set: valueObj })
        .then((data) => resolve({ error: null, data }))
        .catch((error) => resolve({ error, data: null }))
    );
  },
  updateNestedByAttributes(condition, setData, arrFilters, upsert, modal) {
    return new Promise((resolve) =>
      modal
        .updateMany(condition, setData, arrFilters, upsert)
        .then((data) => resolve({ error: null, data }))
        .catch((error) => resolve({ error, data: null }))
    );
  },
  findOneAndUpdate(condition, valueObj, modal) {
    return new Promise((resolve) =>
      modal
        .findOneAndUpdate(condition, { $set: valueObj })
        .then((data) => resolve({ error: null, data }))
        .catch((error) => resolve({ error, data: null }))
    );
  },
  findAndDelete(condition, modal) {
    return new Promise((resolve) =>
      modal
        .findOneAndDelete(condition)
        .then((data) => resolve({ error: null, data }))
        .catch((error) => resolve({ error, data: null }))
    );
  },
  isValidObjectId(id) {
    if (ObjectId.isValid(id)) {
      if (String(new ObjectId(id)) === id) return true;
      return false;
    }
    return false;
  },
  validateToken(token, Modal) {
    return new Promise(async (resolve) => {
      try {
        const validation = joi.validateToken({ token });
        if (validation.error)
          return resolve({ error: "Token cannot be blank.", data: null });
        const response = await this.findByAttribute(
          { forgotPasswordToken: token },
          Modal
        );
        return resolve(response);
      } catch (ex) {
        console.error(ex);
        return resolve({ error: "Something went wrong!", data: null });
      }
    });
  },
  totalItems(match, modal) {
    return new Promise((resolve) => {
      modal
        .aggregate([
          { $match: match },
          { $group: { _id: null, total: { $sum: 1 } } },
        ])
        .exec((error, response) => {
          if (error || response.length === 0) return resolve({ total: 0 });
          return resolve({ total: response[0].total });
        });
    });
  },
  queryExecutor(objParams, Modal) {
    return new Promise((resolve) => {
      const {
        match = {},
        matchCallback = {},
        group = {},
        skip = 0,
        limit = 0,
        sort = {},
        sample = {},
        addFields = {},
        project = {},
        unwind = null,
        lookup = {},
      } = objParams;
      const condition = [];

      if (Object.keys(match).length > 0) {
        condition.push({ $match: match });
      }
      if (Object.keys(lookup).length > 0) {
        condition.push({ $lookup: lookup });
      }
      if (unwind) {
        condition.push({ $unwind: unwind });
      }
      if (Object.keys(matchCallback).length > 0) {
        condition.push({ $match: matchCallback });
      }
      if (Object.keys(project).length > 0) {
        condition.push({ $project: project });
      }
      if (Object.keys(group).length > 0) {
        condition.push({ $group: group });
      }
      if (skip > 0) {
        condition.push({ $skip: skip });
      }
      if (limit > 0) {
        condition.push({ $limit: limit });
      }
      if (Object.keys(sort).length > 0) {
        condition.push({ $sort: sort });
      }
      if (Object.keys(sample).length > 0) {
        condition.push({ $sample: sample });
      }
      if (Object.keys(addFields).length > 0) {
        condition.push({ $addFields: addFields });
      }

      return Modal.aggregate(condition)
        .then((response) => resolve({ response }))
        .catch(() => resolve({ response: [] }));
    });
  },
};
