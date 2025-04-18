const { application } = require("../models");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { renderMailHtml, sendMail } = require("../utils/mail/mail");
const { render } = require("ejs");

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

  if (month && year) {
    filter.start_month = {
      [Op.gte]: new Date(year, month - 1, 1),
      [Op.lt]: new Date(year, month, 1),
    };
  }

  if (search) {
    filter.full_name = { [Op.iLike]: `%${search}%` };
  }

  const totalItems = await application.count({ where: filter });

  const data = await application.findAll({
    where: filter,
    attributes: [
      "id",
      "full_name",
      "division_request",
      "start_month",
      "IPK",
      "intern_category",
      "college_major",
      "google_drive_link",
      "motivation_letter_score",
      "CV_score",
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

exports.getApplicationById = async (id) => {
  const data = await application.findAll({
    where: {
      id,
    },
  });
  if (data.length) {
    return data[0];
  }

  return null;
};

exports.getApplicationEmail = async (email, excludeId = null) => {
  const whereClause = {
    email,
  };

  if (excludeId) {
    whereClause.id = { [Op.ne]: excludeId };
  }

  return application.findOne({
    where: whereClause,
    attributes: ["id"],
  });
};

exports.getApplicationPhone = async (phone, excludeId = null) => {
  const whereClause = {
    phone,
  };

  if (excludeId) {
    whereClause.id = { [Op.ne]: excludeId };
  }

  return application.findOne({
    where: whereClause,
    attributes: ["id"],
  });
};

exports.getApplicationByStartDate = async (start_month) => {
  const date = new Date(start_month);
  const year = date.getFullYear();
  const month = date.getMonth();

  const startOfMonth = new Date(year, month, 1).toISOString().split("T")[0];

  const endOfMonth = new Date(year, month + 1, 0).toISOString().split("T")[0];

  const data = await application.findAll({
    where: {
      start_month: {
        [Op.between]: [startOfMonth, endOfMonth],
      },
    },
  });

  if (data.length) {
    return data;
  }

  return null;
};

exports.createApplication = async (payload) => {
  payload.id = uuidv4();
  const data = await application.create(payload);

  const contentMail = await renderMailHtml("registration-success.ejs", {
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    university: data.university,
    semester: data.semester,
    IPK: data.IPK,
    intern_category: data.intern_category,
    division_request: data.division_request,
    college_major: data.college_major,
    google_drive_link: data.google_drive_link,
    start_month: data.start_month,
    end_month: data.end_month,
    // created_at: data.createdAt,
  });

  await sendMail({
    from: process.env.EMAIL_SMTP_USER,
    to: data.email,
    subject:
      "Pendaftaran Program Magang di KPw Bank Indonesia Provinsi Jawa Tengah",
    html: contentMail,
  });

  console.log("email delivered✉️");
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
