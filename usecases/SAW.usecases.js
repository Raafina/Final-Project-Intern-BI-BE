const applicationRepo = require("../repositories/application.repositories");
const weightRepo = require("../repositories/weight.repositories");
const SAWRepo = require("../repositories/SAW.repositories");
const { v4: uuidv4 } = require("uuid");
const { col } = require("sequelize");

const intern_category_mapping = {
  "Magang Mandiri": 0.8,
  "Magang KRS": 1.0,
};

const college_major_mapping = {
  "Moneter": {
    "Akuntansi": 1.0,
    "Manajemen": 0.9,
    "IT": 0.8,
    "Hukum": 0.7,
    "Statistika": 1.0,
    "Ilmu Sosial": 0.6,
  },
  "Makroprudensial": {
    "Akuntansi": 0.9,
    "Manajemen": 1.0,
    "IT": 0.7,
    "Hukum": 0.8,
    "Statistika": 1.0,
    "Ilmu Sosial": 0.6,
  },
  "Sistem Pembayaran": {
    "Akuntansi": 0.7,
    "Manajemen": 0.8,
    "IT": 1.0,
    "Hukum": 0.6,
    "Statistika": 0.9,
    "Ilmu Sosial": 0.5,
  },
  "Pengelolaan Uang Rupiah": {
    "Akuntansi": 0.8,
    "Manajemen": 0.7,
    "IT": 0.6,
    "Hukum": 0.9,
    "Statistika": 1.0,
    "Ilmu Sosial": 0.5,
  },
  "Humas": {
    "Akuntansi": 0.6,
    "Manajemen": 0.7,
    "IT": 0.5,
    "Hukum": 0.8,
    "Statistika": 0.6,
    "Ilmu Sosial": 1.0,
  },
  "Internal": {
    "Akuntansi": 0.4,
    "Manajemen": 0.9,
    "IT": 0.7,
    "Hukum": 1.0,
    "Statistika": 0.6,
    "Ilmu Sosial": 1.0,
  },
};

// Normalize IPK to a scale of 0 to 1
const normalizeIPK = (ipk) => ipk / 4.0;

exports.calculate = async (start_month, weight_id, division_quota) => {
  const [dataApplicationRaw, dataWeightInstance] = await Promise.all([
    applicationRepo.getApplicationByStartDate(start_month),
    weightRepo.getWeightById(weight_id),
  ]);

  if (!dataWeightInstance || dataWeightInstance === "Data tidak ditemukan") {
    throw new Error("Data bobot tidak ditemukan");
  }

  if (!dataApplicationRaw || dataApplicationRaw === "Data tidak ditemukan") {
    throw new Error("Data pendaftar tidak ditemukan");
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
          college_major_mapping[division]?.[data.college_major] &&
          data.start_month.startsWith(yearMonth)
      );

      applicantsForField = [
        ...applicantsForField,
        ...additionalApplicants,
      ].slice(0, jumlah);
    }

    const normalizedData = applicantsForField.map((d) => {
      const college_major_score =
        college_major_mapping[division]?.[d.college_major] || 0.2;

      return {
        ...d,
        original_IPK: d.IPK,
        original_intern_category: d.intern_category,
        original_college_major: d.college_major,
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
    IPK: selected.original_IPK,
    intern_category: selected.original_intern_category,
    college_major: selected.original_college_major,
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
  console.log(formattedResults);
  return formattedResults;
};

exports.getSAW_Results = async ({
  month,
  year,
  page = 1,
  limit = 10,
  sort = "asc",
  sortBy = "full_name",
  search = "",
}) => {
  const { data, totalItems, totalPages } = await SAWRepo.getSAW_Results({
    month,
    year,
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
    sortBy,
    search,
  });

  return {
    data,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
    },
  };
};
