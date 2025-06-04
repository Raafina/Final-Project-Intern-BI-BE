const { application } = require("../models");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { renderMailHtml, sendMail } = require("../utils/mail/mail");

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
      "KRS_remaining",
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

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  }

  const contentMail = await renderMailHtml("registration-success.ejs", {
    full_name: payload.full_name,
    email: payload.email,
    phone: payload.phone,
    university: payload.university,
    semester: payload.semester,
    IPK: payload.IPK,
    intern_category: payload.intern_category,
    division_request: payload.division_request,
    college_major: payload.college_major,
    google_drive_link: payload.google_drive_link,
    start_month: formatDate(payload.start_month),
    end_month: formatDate(payload.end_month),
    createdAt: formatDate(new Date()),
  });

  await sendMail({
    from: process.env.EMAIL_SMTP_USER,
    to: payload.email,
    subject:
      "Pendaftaran Program Magang di KPw Bank Indonesia Provinsi Jawa Tengah",
    html: contentMail,
  });

  if (!contentMail) {
    return null;
  }

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
