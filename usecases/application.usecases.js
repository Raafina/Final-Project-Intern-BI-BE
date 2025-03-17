const applicationRepo = require('../repositories/application.repositories');

exports.getApplications = async ({
  month,
  year,
  page = 1,
  limit = 10,
  sort = 'asc',
  sortBy = 'nama_lengkap',
  search = '',
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
      nama_lengkap: item.nama_lengkap,
      rencana_mulai: item.rencana_mulai,
      IPK: item.IPK,
      tipe_magang: item.tipe_magang,
      jurusan: item.jurusan,
      google_drive_link: item.google_drive_link,
      skor_motivation_letter: item.skor_motivation_letter,
      skor_CV: item.skor_CV,
    })),
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
    },
  };
};

exports.getApplication = async (id) => {
  const data = await applicationRepo.getApplication(id);
  return data;
};

exports.createApplication = async (payload) => {
  const data = await applicationRepo.createApplication(payload);
  return data;
};
exports.updateApplication = async (id, payload) => {
  await applicationRepo.updateApplication(id, payload);
  const data = applicationRepo.getApplication(id);
  return data;
};

exports.deleteApplication = async (id) => {
  const data = await applicationRepo.deleteApplication(id);
  return data;
};
