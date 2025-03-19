const { application } = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
exports.getApplications = async ({
  month,
  year,
  page,
  limit,
  sort,
  sortBy,
  search,
}) => {
  const filter = {};

  // Filter berdasarkan bulan & tahun rencana_mulai
  if (month && year) {
    filter.rencana_mulai = {
      [Op.gte]: new Date(year, month - 1, 1), // Awal bulan
      [Op.lt]: new Date(year, month, 1), // Awal bulan berikutnya
    };
  }

  if (search) {
    filter.nama_lengkap = { [Op.iLike]: `%${search}%` };
  }

  const totalItems = await application.count({ where: filter });

  const data = await application.findAll({
    where: filter,
    attributes: [
      'id',
      'nama_lengkap',
      'bidang_kerja',
      'rencana_mulai',
      'IPK',
      'tipe_magang',
      'jurusan',
      'google_drive_link',
      'skor_motivation_letter',
      'skor_CV',
    ],
    order: [[sortBy || 'nama_lengkap', sort || 'asc']],
    offset: (page - 1) * limit,
    limit: limit,
  });

  return {
    data,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  };
};

exports.getApplicationById = async (id) => {
  const data = await application.findAll({
    where: {
      id,
    },
  });
  if (data.length) {
    return data[0];
  }

  return 'Data tidak ditemukan';
};

exports.getApplicationByStartDate = async (rencana_mulai) => {
  const date = new Date(rencana_mulai);
  const year = date.getFullYear();
  const month = date.getMonth();

  const startOfMonth = new Date(year, month, 1).toISOString().split('T')[0];

  const endOfMonth = new Date(year, month + 1, 0).toISOString().split('T')[0];

  const data = await application.findAll({
    where: {
      rencana_mulai: {
        [Op.between]: [startOfMonth, endOfMonth],
      },
    },
  });

  if (data.length) {
    return data;
  }

  return 'Data tidak ditemukan';
};

exports.createApplication = async (payload) => {
  payload.id = uuidv4();
  const data = await application.create(payload);
  return data;
};

exports.updateApplication = async (id, payload) => {
  await application.update(payload, {
    where: { id },
  });

  const data = await application.findAll({
    where: {
      id,
    },
  });

  return data;
};

exports.deleteApplication = async (id) => {
  await application.destroy({
    where: { id },
  });

  return null;
};
