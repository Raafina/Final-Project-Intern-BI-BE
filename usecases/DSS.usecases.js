// Adaptasi dari SAW ke MOORA dengan tambahan cost: KRS_remaining
const applicationRepo = require("../repositories/application.repositories");
const weightRepo = require("../repositories/weight.repositories");
const DSSRepo = require("../repositories/DSS.repositories");
const { v4: uuidv4 } = require("uuid");

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

// Vector Normalization
const vectorNormalize = (data, keys) => {
  const denom = {};
  keys.forEach((key) => {
    denom[key] = Math.sqrt(
      data.reduce((acc, cur) => acc + Math.pow(cur[key], 2), 0)
    );
  });
  return data.map((d) => {
    const normalized = {};
    keys.forEach((key) => {
      normalized[key] = d[key] / (denom[key] || 1); // Default to 1 if denom is 0
    });
    return { ...d, ...normalized };
  });
};

exports.calculate = async (year, month, weight_id, division_quota) => {
  const startMonthString = `${year}-${String(month).padStart(2, "0")}`;
  const [dataApplicationRaw, dataWeightInstance] = await Promise.all([
    applicationRepo.getApplicationByStartDate(startMonthString),
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
    await DSSRepo.deleteDSS_Result(dataApplication.map((d) => d.id));
  }

  const dataWeight = JSON.parse(JSON.stringify(dataWeightInstance));
  const assignedApplicants = new Set();
  const selectedCandidates = [];
  const division_accepted = {};

  for (const [division, jumlah] of Object.entries(division_quota)) {
    if (jumlah <= 0 || !college_major_mapping[division]) continue;

    const applicantsMatched = dataApplication.filter(
      (item) =>
        item.division_request === division &&
        !assignedApplicants.has(item.id) &&
        item.start_month.startsWith(startMonthString)
    );

    const applicantsUnmatched = dataApplication.filter(
      (item) =>
        item.division_request !== division &&
        !assignedApplicants.has(item.id) &&
        college_major_mapping[division]?.[item.college_major] &&
        item.start_month.startsWith(startMonthString)
    );

    let applicantsForField = [
      ...applicantsMatched,
      ...applicantsUnmatched,
    ].slice(0, jumlah);

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
        KRS_remaining: parseFloat(d.KRS_remaining) ?? 0,
      };
    });

    const benefit_keys = [
      "IPK",
      "intern_category",
      "college_major",
      "CV_score",
      "motivation_letter_score",
    ];
    const cost_keys = ["KRS_remaining"];

    const normalizedBenefit = vectorNormalize(normalizedData, benefit_keys);
    const normalizedAll = vectorNormalize(normalizedBenefit, cost_keys);

    const scored = normalizedAll.map((d) => {
      // calculate total score MOORA using benefit dan cost
      const benefit_score = benefit_keys.reduce(
        (sum, key) => sum + d[key] * dataWeight[`${key}_weight`],
        0
      );
      const cost_score = cost_keys.reduce(
        (sum, key) => sum + d[key] * dataWeight[`${key}_weight`],
        0
      );
      const total_score = benefit_score - cost_score;
      return { ...d, total_score };
    });

    const ranked = scored
      .sort((a, b) => b.total_score - a.total_score)
      .slice(0, jumlah);

    ranked.forEach((s) => {
      assignedApplicants.add(s.id);
      division_accepted[s.id] = {
        division_category: division,
      };
    });

    selectedCandidates.push(...ranked);
  }

  const formattedResults = selectedCandidates.map((selected) => ({
    id: uuidv4(),
    application_id: selected.id,
    full_name: selected.full_name,
    email: selected.email,
    start_month: selected.start_month,
    accepted_division: division_accepted[selected.id].division_category,
    IPK: selected.original_IPK,
    email: selected.email,
    intern_category: selected.original_intern_category,
    college_major: selected.original_college_major,
    IPK_score: selected.IPK,
    intern_category_score: selected.intern_category,
    college_major_score: selected.college_major,
    CV_score: selected.CV_score,
    motivation_letter_score: selected.motivation_letter_score,
    KRS_remaining_score: selected.KRS_remaining,
    total_score: selected.total_score,
  }));

  if (formattedResults.length > 0) {
    await DSSRepo.saveDSS_Result(formattedResults);
  }

  return formattedResults.length > 0 ? formattedResults : null;
};

exports.getDSS_Results = async ({
  month,
  year,
  page = 1,
  limit = 10,
  sort = "asc",
  sortBy = "full_name",
  search = "",
}) => {
  const { data, totalItems, totalPages } = await DSSRepo.getDSS_Results({
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

exports.sendMail_Results = async (payload) => {
  await DSSRepo.sendMail_Results(payload);

  return true;
};
