const applicationRepo = require('../repositories/application.repositories');

exports.getApplications = async () => {
  const datas = await applicationRepo.getApplications();

  return datas.map((data) => ({
    id: data.id,
    nama_lengkap: data.nama_lengkap,
    rencana_mulai: data.rencana_mulai,
    IPK: data.IPK,
    tipe_magang: data.tipe_magang,
    program_studi: data.program_studi,
    motivation_letter_score: data.motivation_letter_score,
    CV_score: data.CV_score,
  }));
};

exports.getApplication = async (id) => {
  const data = await applicationRepo.getApplication(id);

  return data;
};

exports.deleteApplication = async (id) => {
  const data = await applicationRepo.deleteApplication(id);

  return data;
};
