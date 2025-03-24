const { SAW_Result } = require('../models');

exports.getSAW_Results = async ({
  start_date,
  page,
  limit,
  sort,
  sortBy,
  search,
}) => {
  if (search) {
    filter.full_name = { [Op.iLike]: `%${search}%` };
  }

  const totalItems = await SAW_Result.count({ where: filter });

  const data = await SAW_Result.findAll({
    where: filter,
    attributes: [
      'id',
      'full_name',
      'start_month',
      'IPK',
      'intern_category',
      'college_major',
      'division_request',
      'google_drive_link',
    ],
    order: [[sortBy || 'full_name', sort || 'asc']],
    offset: (page - 1) * limit,
    limit: limit,
  });

  return {
    data,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  };
};

exports.saveSAW_Result = async (payload) => {
  const data = await SAW_Result.bulkCreate(payload);
  return data;
};

exports.updateSAW_Result = async (application_id, payload) => {
  const data = await SAW_Result.update(payload, {
    where: {
      application_id,
    },
  });
  return data;
};

exports.deleteSAW_Result = async (application_id) => {
  const data = await SAW_Result.destroy({
    where: {
      application_id,
    },
  });

  return data;
};
