module.exports = async function (model, data, next, initialValue = 1) {
  const total = await model.aggregate([{ $sort: { id: -1 } }, { $limit: 1 }]);
  data.id =
    total.length === 0 || !total[0]?.id
      ? initialValue
      : Number(total[0].id) + 1;
  next();
};
