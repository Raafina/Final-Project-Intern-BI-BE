const applicationRepo = require('../repositories/application.repositories');
const weightRepo = require('../repositories/weight.repositories');
const SAWRepo = require('../repositories/saw.repositories');
const { v4: uuidv4 } = require('uuid');
const { col } = require('sequelize');

const kategoriMagangMapping = {
  magang_mandiri: 0.8,
  magang_KRS: 1.0,
};

const jurusanMapping = {
  moneter: {
    akuntansi: 1.0,
    manajemen: 0.9,
    it: 0.8,
    hukum: 0.7,
    statistika: 1.0,
    ilmu_sosial: 0.6,
  },
  makroprudensial: {
    akuntansi: 0.9,
    manajemen: 1.0,
    it: 0.7,
    hukum: 0.8,
    statistika: 1.0,
    ilmu_sosial: 0.6,
  },
  sistem_pembayaran: {
    akuntansi: 0.7,
    manajemen: 0.8,
    it: 1.0,
    hukum: 0.6,
    statistika: 0.9,
    ilmu_sosial: 0.5,
  },
  pengelolaan_uang_rupiah: {
    akuntansi: 0.8,
    manajemen: 0.7,
    it: 0.6,
    hukum: 0.9,
    statistika: 1.0,
    ilmu_sosial: 0.5,
  },
  humas: {
    akuntansi: 0.6,
    manajemen: 0.7,
    it: 0.5,
    hukum: 0.8,
    statistika: 0.6,
    ilmu_sosial: 1.0,
  },
  internal: {
    akuntansi: 0.4,
    manajemen: 0.9,
    it: 0.7,
    hukum: 1.0,
    statistika: 0.6,
    ilmu_sosial: 1.0,
  },
};

// Normalize IPK to a scale of 0 to 1
const normalizeIPK = (ipk) => ipk / 4.0;

exports.calculate = async (
  rencana_mulai,
  weight_id,
  kebutuhan_bidang_kerja
) => {
  const [dataApplicationRaw, dataWeightInstance] = await Promise.all([
    applicationRepo.getApplicationByStartDate(rencana_mulai),
    weightRepo.getWeightById(weight_id),
  ]);
  console.log(dataApplicationRaw, 'cek');

  if (
    !dataApplicationRaw ||
    !dataWeightInstance ||
    dataApplicationRaw === 'Data tidak ditemukan' ||
    dataWeightInstance === 'Data tidak ditemukan'
  ) {
    throw new Error('Data tidak ditemukan');
  }

  const dataApplication = dataApplicationRaw.map(
    (app) => app.dataValues || app
  );

  if (dataApplication.length > 0) {
    await SAWRepo.deleteSAW_Result(dataApplication.map((d) => d.id));
  }

  const dataWeight = JSON.parse(JSON.stringify(dataWeightInstance));

  const assignedApplicants = new Set();
  const selectedCandidates = [];

  const posisiPenempatan = {};

  for (const [bidang, jumlah] of Object.entries(kebutuhan_bidang_kerja)) {
    if (jumlah <= 0 || !jurusanMapping[bidang]) continue;

    const yearMonth = rencana_mulai.substring(0, 7); // YYYY-MM format

    let applicantsForField = dataApplication.filter(
      (item) =>
        item.bidang_kerja === bidang &&
        !assignedApplicants.has(item.id) &&
        item.rencana_mulai.startsWith(yearMonth)
    );

    if (applicantsForField.length < jumlah) {
      const additionalApplicants = dataApplication.filter(
        (data) =>
          !applicantsForField.includes(data) &&
          !assignedApplicants.has(data.id) &&
          jurusanMapping[bidang]?.[data.jurusan?.toLowerCase()] &&
          data.rencana_mulai.startsWith(yearMonth)
      );

      applicantsForField = [
        ...applicantsForField,
        ...additionalApplicants,
      ].slice(0, jumlah);
    }

    if (applicantsForField.length === 0) {
      console.log(`No suitable applicants found for ${bidang}`);
      continue;
    }

    const normalizedData = applicantsForField.map((d) => {
      const jurusanScore =
        jurusanMapping[bidang]?.[d.jurusan?.toLowerCase()] || 0.2;

      return {
        ...d,
        IPK: normalizeIPK(parseFloat(d.IPK)),
        tipe_magang: kategoriMagangMapping[d.tipe_magang] || 0.5,
        jurusan: jurusanScore,
        skor_CV: (parseFloat(d.skor_CV) ?? 0) / 100,
        skor_motivation_letter:
          (parseFloat(d.skor_motivation_letter) ?? 0) / 100,
      };
    });

    const rankedData = normalizedData
      .map((d) => {
        const total_skor =
          d.IPK * dataWeight.bobot_IPK +
          d.tipe_magang * dataWeight.bobot_tipe_magang +
          d.jurusan * dataWeight.bobot_jurusan +
          d.skor_CV * dataWeight.bobot_skor_CV +
          d.skor_motivation_letter * dataWeight.bobot_skor_motivation_letter;

        return { ...d, total_skor };
      })
      .sort((a, b) => b.total_skor - a.total_skor);

    const selected = rankedData.slice(0, jumlah);

    selected.forEach((s) => {
      assignedApplicants.add(s.id);

      posisiPenempatan[s.id] = {
        bidang_penempatan: bidang,
      };
    });

    selectedCandidates.push(...selected);
  }

  const formattedResults = selectedCandidates.map((selected) => ({
    id: uuidv4(),
    application_id: selected.id,
    full_name: selected.nama_lengkap,
    email: selected.email,
    start_month: selected.rencana_mulai,
    accepted_division: posisiPenempatan[selected.id].bidang_penempatan,
    IPK_score: selected.IPK,
    intern_category_score: selected.tipe_magang,
    college_major_score: selected.jurusan,
    CV_score: selected.skor_CV,
    motivation_letter_score: selected.skor_motivation_letter,
    total_score: selected.total_skor,
  }));

  if (formattedResults.length > 0) {
    await SAWRepo.saveSAW_Result(formattedResults);
  }

  if (formattedResults.length === 0) {
    return null;
  }

  return formattedResults;
};
