const { DSS_Result, application } = require("../models");
const { Op } = require("sequelize");
const { renderMailHtml, sendMail } = require("../utils/mail/mail");
exports.getDSS_Results = async ({
  month,
  year,
  page = 1,
  limit = 10,
  sort = "asc",
  sortBy = "total_score",
  search = "",
}) => {
  const appFilter = {};
  if (month && year) {
    appFilter.start_month = {
      [Op.gte]: new Date(year, month - 1, 1),
      [Op.lt]: new Date(year, month, 1),
    };
  }
  if (search) {
    appFilter.full_name = { [Op.iLike]: `%${search}%` };
  }

  const applicationColumns = [
    "full_name",
    "college_major",
    "start_month",
    "IPK",
    "email",
    "intern_category",
    "CV_score",
    "motivation_letter_score",
  ];

  let order = [];

  if (
    ["total_score", "accepted_division", "createdAt", "updatedAt"].includes(
      sortBy
    )
  ) {
    order = [[sortBy, sort.toUpperCase()]];
  } else if (applicationColumns.includes(sortBy)) {
    order = [
      [{ model: application, as: "application" }, sortBy, sort.toUpperCase()],
    ];
  }

  const { count, rows } = await DSS_Result.findAndCountAll({
    include: [
      {
        model: application,
        as: "application",
        where: appFilter,
        attributes: applicationColumns,
      },
    ],
    order,
    offset: (page - 1) * limit,
    limit: limit,
  });

  const data = rows.map((row) => ({
    id: row.id,
    total_score: row.total_score,
    accepted_division: row.accepted_division,
    ...row.application.dataValues,
  }));

  return {
    data,
    totalItems: count,
    totalPages: Math.ceil(count / limit),
  };
};

exports.saveDSS_Result = async (payload) => {
  const data = await DSS_Result.bulkCreate(payload);
  console.log(data);
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

exports.deleteDSS_Result = async (application_id) => {
  const data = await DSS_Result.destroy({
    where: {
      application_id,
    },
  });

  return data;
};
