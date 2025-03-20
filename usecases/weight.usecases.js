const weightRepo = require('../repositories/weight.repositories');

exports.getWeights = async ({
  page = 1,
  limit = 10,
  sort = 'asc',
  sortBy = 'name',
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
  const check_unique_name = await weightRepo.getWeightName(payload.name);
  if (check_unique_name) {
    throw {
      statusCode: 409,
      message: 'Bobot dengan nama ini sudah tersedia',
    };
  }
  const data = await weightRepo.createWeight(payload);
  return data;
};

exports.updateWeight = async (id, payload) => {
  const check_unique_name = await weightRepo.getWeightName(payload.name, id);
  if (check_unique_name) {
    throw {
      statusCode: 409,
      message: 'Bobot dengan nama ini sudah tersedia',
    };
  }
  await weightRepo.updateWeight(id, payload);
  const data = weightRepo.getWeightById(id);
  return data;
};

exports.deleteWeight = async (id) => {
  const check_weight_id = await weightRepo.getWeightById(id);
  if (!check_weight_id) {
    throw { statusCode: 404, message: 'Data bobot tidak ditemukan' };
  }
  const data = await weightRepo.deleteWeight(id);
  return data;
};
