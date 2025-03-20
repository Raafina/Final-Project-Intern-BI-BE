const applicationRepo = require('../repositories/application.repositories');
const weightRepo = require('../repositories/weight.repositories');
const SAWRepo = require('../repositories/saw.repositories');
const { v4: uuidv4 } = require('uuid');
const { col } = require('sequelize');

const intern_category_mapping = {
  magang_mandiri: 0.8,
  magang_KRS: 1.0,
};

const college_major_mapping = {
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

exports.calculate = async (start_month, weight_id, division_quota) => {
  const [dataApplicationRaw, dataWeightInstance] = await Promise.all([
    applicationRepo.getApplicationByStartDate(start_month),
    weightRepo.getWeightById(weight_id),
  ]);
  console.log(dataApplicationRaw, 'cek');

  if (!dataWeightInstance || dataWeightInstance === 'Data tidak ditemukan') {
    throw new Error('Data bobot tidak ditemukan');
  }

  if (!dataApplicationRaw || dataApplicationRaw === 'Data tidak ditemukan') {
    throw new Error('Data pendaftar tidak ditemukan');
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

  const division_accepted = {};

  for (const [division, jumlah] of Object.entries(division_quota)) {
    if (jumlah <= 0 || !college_major_mapping[division]) continue;

    const yearMonth = start_month.substring(0, 7); // YYYY-MM format

    let applicantsForField = dataApplication.filter(
      (item) =>
        item.division_kerja === division &&
        !assignedApplicants.has(item.id) &&
        item.start_month.startsWith(yearMonth)
    );

    if (applicantsForField.length < jumlah) {
      const additionalApplicants = dataApplication.filter(
        (data) =>
          !applicantsForField.includes(data) &&
          !assignedApplicants.has(data.id) &&
          college_major_mapping[division]?.[
            data.college_major?.toLowerCase()
          ] &&
          data.start_month.startsWith(yearMonth)
      );

      applicantsForField = [
        ...applicantsForField,
        ...additionalApplicants,
      ].slice(0, jumlah);
    }

    if (applicantsForField.length === 0) {
      console.log(`No suitable applicants found for ${division}`);
      continue;
    }

    const normalizedData = applicantsForField.map((d) => {
      const college_major_score =
        college_major_mapping[division]?.[d.college_major?.toLowerCase()] ||
        0.2;

      return {
        ...d,
        IPK: normalizeIPK(parseFloat(d.IPK)),
        intern_category: intern_category_mapping[d.intern_category] || 0.5,
        college_major: college_major_score,
        CV_score: (parseFloat(d.CV_score) ?? 0) / 100,
        motivation_letter_score:
          (parseFloat(d.motivation_letter_score) ?? 0) / 100,
      };
    });

    const rankedData = normalizedData
      .map((d) => {
        const total_score =
          d.IPK * dataWeight.IPK_weight +
          d.intern_category * dataWeight.intern_category_weight +
          d.college_major * dataWeight.college_major_weight +
          d.CV_score * dataWeight.CV_score_weight +
          d.motivation_letter_score * dataWeight.motivation_letter_score_weight;

        return { ...d, total_score };
      })
      .sort((a, b) => b.total_score - a.total_score);

    const selected = rankedData.slice(0, jumlah);

    selected.forEach((s) => {
      assignedApplicants.add(s.id);

      division_accepted[s.id] = {
        division_category: division,
      };
    });

    selectedCandidates.push(...selected);
  }

  const formattedResults = selectedCandidates.map((selected) => ({
    id: uuidv4(),
    application_id: selected.id,
    full_name: selected.full_name,
    email: selected.email,
    start_month: selected.start_month,
    accepted_division: division_accepted[selected.id].division_category,
    IPK_score: selected.IPK,
    intern_category_score: selected.intern_category,
    college_major_score: selected.college_major,
    CV_score: selected.CV_score,
    motivation_letter_score: selected.motivation_letter_score,
    total_score: selected.total_score,
  }));

  if (formattedResults.length > 0) {
    await SAWRepo.saveSAW_Result(formattedResults);
  }

  if (formattedResults.length === 0) {
    return null;
  }

  return formattedResults;
};
