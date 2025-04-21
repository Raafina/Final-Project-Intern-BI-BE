const { SAW_Result } = require("../models");
const { Op } = require("sequelize");
const { renderMailHtml, sendMail } = require("../utils/mail/mail");
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

exports.sendMail_Results = async (payload) => {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  }

  const contentMail = await renderMailHtml("accepted-intern.ejs", {
    full_name: payload.full_name,
    email: payload.email,
    accepted_division: payload.accepted_division,
    onboarding_date: formatDate(payload.onboarding_date),
    onboarding_time: payload.onboarding_time,
  });
  console.log(payload, "payload");
  await sendMail({
    from: process.env.EMAIL_SMTP_USER,
    to: payload.email,
    subject:
      "Hasil Seleksi Program Magang di KPw Bank Indonesia Provinsi Jawa Tengah",
    html: contentMail,
  });
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
