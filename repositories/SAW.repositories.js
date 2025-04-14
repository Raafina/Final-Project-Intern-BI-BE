const { SAW_Result } = require("../models");
const { Op } = require("sequelize");
exports.getSAW_Results = async ({
  month,
  year,
  page,
  limit,
  sort,
  sortBy,
  search,
}) => {
  const filter = {};

  if (month && year) {
    filter.start_month = {
      [Op.gte]: new Date(year, month - 1, 1),
      [Op.lt]: new Date(year, month, 1),
    };
  }

  if (search) {
    filter.full_name = { [Op.iLike]: `%${search}%` };
  }

  const totalItems = await SAW_Result.count({ where: filter });

  const data = await SAW_Result.findAll({
    where: filter,
    attributes: [
      "id",
      "full_name",
      "accepted_division",
      "college_major",
      "start_month",
      "IPK",
      "intern_category",
      "CV_score",
      "motivation_letter_score",
      "total_score",
    ],
    order: [[sortBy || "full_name", sort || "asc"]],
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
