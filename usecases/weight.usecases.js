const weightRepo = require('../repositories/weight.repositories');

exports.getWeights = async ({
  page = 1,
  limit = 10,
  sort = 'asc',
  sortBy = 'nama',
  search,
}) => {
  const { data, totalItems, totalPages } = await weightRepo.getWeights({
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
    sortBy,
    search,
  });

  return {
    data,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
    },
  };
};
exports.getWeight = async (id) => {
  const data = await weightRepo.getWeightById(id);
  return data;
};

exports.createWeight = async (payload) => {
  const data = await weightRepo.createWeight(payload);
  return data;
};

exports.updateWeight = async (id, payload) => {
  await weightRepo.updateWeight(id, payload);
  const data = weightRepo.getWeight(id);
  return data;
};

exports.deleteWeight = async (id) => {
  const data = await weightRepo.deleteWeight(id);
  return data;
};
