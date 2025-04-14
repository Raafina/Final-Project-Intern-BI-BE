const applicationRepo = require("../repositories/application.repositories");

exports.getApplications = async ({
  month,
  year,
  page = 1,
  limit = 10,
  sort = "asc",
  sortBy = "full_name",
  search = "",
}) => {
  const { data, totalItems, totalPages } =
    await applicationRepo.getApplications({
      month,
      year,
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      sortBy,
      search,
    });

  return {
    data: data.map((item) => ({
      id: item.id,
      full_name: item.full_name,
      start_month: item.start_month,
      IPK: item.IPK,
      intern_category: item.intern_category,
      college_major: item.college_major,
      division_request: item.division_request,
      google_drive_link: item.google_drive_link,
      CV_score: item.CV_score,
      motivation_letter_score: item.motivation_letter_score,
    })),
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
    },
  };
};

exports.getApplication = async (id) => {
  const data = await applicationRepo.getApplicationById(id);
  return data;
};

exports.getApplicationByStartDate = async (start_month) => {
  const data = await applicationRepo.getApplicationByStartDate(start_month);

  return data;
};

exports.createApplication = async (payload) => {
  const check_unique_email = await applicationRepo.getApplicationEmail(
    payload.email
  );
  const check_unique_phone = await applicationRepo.getApplicationPhone(
    payload.phone
  );

  if (check_unique_email) {
    throw { statusCode: 409, message: "Email ini sudah melakukan pendaftaran" };
  }
  if (check_unique_phone) {
    throw { statusCode: 409, message: "No HP ini sudah melakukan pendaftaran" };
  }

  const data = await applicationRepo.createApplication(payload);
  return data;
};
exports.updateApplication = async (id, payload) => {
  const check_unique_email = await applicationRepo.getApplicationEmail(
    payload.email,
    id
  );
  const check_unique_phone = await applicationRepo.getApplicationPhone(
    payload.phone,
    id
  );

  if (check_unique_email) {
    throw {
      statusCode: 409,
      message: "Email ini sudah melakukan pendaftaran",
    };
  }
  if (check_unique_phone) {
    throw {
      statusCode: 409,
      message: "No HP ini sudah melakukan pendaftaran",
    };
  }

  await applicationRepo.updateApplication(id, payload);
  const data = applicationRepo.getApplicationById(id);
  return data;
};

exports.deleteApplication = async (id) => {
  const check_application_id = await applicationRepo.getApplicationById(id);
  if (!check_application_id) {
    throw { statusCode: 404, message: "Data pendaftar tidak ditemukan" };
  } else {
    const data = await applicationRepo.deleteApplication(id);
    return data;
  }
};
