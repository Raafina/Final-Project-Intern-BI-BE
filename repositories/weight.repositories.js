const { weight } = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
exports.getWeights = async ({ page, limit, sort, sortBy, search }) => {
  const filter = {};
  if (search) {
    filter.nama = { [Op.iLike]: `%${search}%` };
  }
  const totalItems = await weight.count({ where: filter });

  const data = await weight.findAll({
    where: filter,
    attributes: [
      'id',
      'nama',
      'bobot_IPK',
      'bobot_tipe_magang',
      'bobot_jurusan',
      'bobot_skor_CV',
      'bobot_skor_motivation_letter',
    ],
    order: [[sortBy || 'nama', sort || 'asc']],
    offset: (page - 1) * limit,
    limit,
  });
  return {
    data,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  };
};

exports.getWeightById = async (id) => {
  const data = await weight.findAll({
    where: {
      id,
    },
  });
  if (data.length) {
    return data[0];
  }

  return 'Data tidak ditemukan';
};

exports.createWeight = async (payload) => {
  payload.id = uuidv4();
  const data = await weight.create(payload);
  return data;
};

exports.updateWeight = async (id, payload) => {
  await weight.update(payload, {
    where: { id },
  });

  const data = await weight.findAll({
    where: {
      id,
    },
  });

  return data;
};

exports.deleteWeight = async (id) => {
  await weight.destroy({
    where: { id },
  });

  return null;
};
