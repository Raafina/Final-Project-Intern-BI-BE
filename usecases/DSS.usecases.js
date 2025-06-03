const applicationRepo = require("../repositories/application.repositories");
const weightRepo = require("../repositories/weight.repositories");
const DSSRepo = require("../repositories/DSS.repositories");
const { v4: uuidv4 } = require("uuid");

// Mapping for internship category to score
const intern_category_mapping = {
  "Magang Mandiri": 0.8,
  "Magang KRS": 1.0,
};

// Mapping for college major scores based on requested division
const college_major_mapping = {
  "Moneter": {
    "Akuntansi": 1.0,
    "Manajemen": 0.9,
    "IT": 0.8,
    "Hukum": 0.7,
    "Statistika": 1.0,
    "Ilmu Sosial": 0.6,
    "Ekonomi": 1.0,
  },
  "Makroprudensial": {
    "Akuntansi": 0.9,
    "Manajemen": 1.0,
    "IT": 0.7,
    "Hukum": 0.8,
    "Statistika": 1.0,
    "Ilmu Sosial": 0.6,
    "Ekonomi": 1.0,
  },
  "Sistem Pembayaran": {
    "Akuntansi": 0.7,
    "Manajemen": 0.8,
    "IT": 1.0,
    "Hukum": 0.6,
    "Statistika": 0.9,
    "Ilmu Sosial": 0.5,
    "Ekonomi": 0.8,
  },
  "Pengelolaan Uang Rupiah": {
    "Akuntansi": 0.8,
    "Manajemen": 0.7,
    "IT": 0.6,
    "Hukum": 0.9,
    "Statistika": 1.0,
    "Ilmu Sosial": 0.5,
    "Ekonomi": 0.7,
  },
  "Humas": {
    "Akuntansi": 0.6,
    "Manajemen": 0.7,
    "IT": 0.5,
    "Hukum": 0.8,
    "Statistika": 0.6,
    "Ilmu Sosial": 1.0,
    "Ekonomi": 0.6,
  },
  "Internal": {
    "Akuntansi": 0.4,
    "Manajemen": 0.9,
    "IT": 0.7,
    "Hukum": 1.0,
    "Statistika": 0.6,
    "Ilmu Sosial": 1.0,
    "Ekonomi": 0.7,
  },
};

// Normalize GPA to a 0-1 scale
const normalizeIPK = (ipk) => ipk / 4.0;

// MOORA Vector Normalization for multiple applicants
const mooraVectorNormalize = (data, keys) => {
  if (!data || data.length === 0) return [];

  const denom = {};

  // Step 1: Calculate the denominator for each criterion
  // Formula: √(Σ(xij²)) for each criterion j
  keys.forEach((key) => {
    denom[key] = Math.sqrt(
      data.reduce((acc, cur) => acc + Math.pow(cur[key], 2), 0)
    );
  });

  console.log("Denominator for normalization per key:", denom);

  // Step 2: Normalize each value
  // Formula: rij = xij / √(Σ(xij²))
  const normalizedData = data.map((d) => {
    const normalized = {};
    keys.forEach((key) => {
      normalized[key] = d[key] / (denom[key] || 1);
    });
    return { ...d, ...normalized };
  });

  console.log("Data after MOORA vector normalization:", normalizedData);
  return normalizedData;
};

// Process calculations for a specific division
const processDivision = (divisionData, dataWeight, division) => {
  console.log(
    `Processing division: ${division} with ${divisionData.length} candidates`
  );

  // Perform MOORA vector normalization per division
  const benefit_keys = [
    "IPK",
    "intern_category",
    "college_major",
    "CV_score",
    "motivation_letter_score",
  ];
  const cost_keys = ["KRS_remaining"];
  const all_keys = [...benefit_keys, ...cost_keys];

  const mooraNormalizedData = mooraVectorNormalize(divisionData, all_keys);

  // Calculate MOORA scores
  const scoredData = mooraNormalizedData.map((d) => {
    const weighted_benefits = {};
    const weighted_costs = {};

    benefit_keys.forEach((key) => {
      weighted_benefits[key] = d[key] * dataWeight[`${key}_weight`];
    });

    cost_keys.forEach((key) => {
      weighted_costs[key] = d[key] * dataWeight[`${key}_weight`];
    });

    const benefit_score = benefit_keys.reduce(
      (sum, key) => sum + weighted_benefits[key],
      0
    );
    const cost_score = cost_keys.reduce(
      (sum, key) => sum + weighted_costs[key],
      0
    );

    const total_score = benefit_score - cost_score;

    return {
      ...d,
      total_score,
      benefit_score,
      cost_score,
      weighted_benefits,
      weighted_costs,
    };
  });

  console.log(`Scored data for division ${division}:`, scoredData);
  return scoredData;
};

exports.calculate = async (year, month, weight_id, division_quota) => {
  const startMonthString = `${year}-${String(month).padStart(2, "0")}`;

  // Step 1: Retrieve applicant data and weight configuration
  const [dataApplicationRaw, dataWeightInstance] = await Promise.all([
    applicationRepo.getApplicationByStartDate(startMonthString),
    weightRepo.getWeightById(weight_id),
  ]);

  if (!dataWeightInstance) throw new Error("Weight configuration not found");
  if (!dataApplicationRaw || dataApplicationRaw.length === 0)
    throw new Error("No applicants found");

  const dataApplication = dataApplicationRaw.map(
    (app) => app.dataValues || app
  );

  console.log(
    `Retrieved ${dataApplication.length} applicants for ${startMonthString}`
  );

  // Delete any existing DSS results for these applicants
  if (dataApplication.length > 0) {
    await DSSRepo.deleteDSS_Result(dataApplication.map((d) => d.id));
    console.log("Deleted existing DSS results for current applicants.");
  }

  // Step 2: Normalize weights from 0-100 to 0-1
  const dataWeight = JSON.parse(JSON.stringify(dataWeightInstance));
  const weightKeys = [
    "IPK_weight",
    "intern_category_weight",
    "college_major_weight",
    "KRS_remaining_weight",
    "CV_score_weight",
    "motivation_letter_score_weight",
  ];

  weightKeys.forEach((key) => {
    if (typeof dataWeight[key] === "number") {
      dataWeight[key] = dataWeight[key] / 100;
    }
  });

  console.log("Normalized weights:", dataWeight);

  // Step 3: Filter only divisions with available quota and proper mapping
  const relevantDivisions = Object.keys(division_quota).filter(
    (division) =>
      division_quota[division] > 0 && college_major_mapping[division]
  );

  console.log("Relevant divisions with quota:", relevantDivisions);

  const allRelevantData = dataApplication.filter(
    (item) =>
      relevantDivisions.includes(item.division_request) &&
      item.start_month.startsWith(startMonthString)
  );

  if (allRelevantData.length === 0) {
    console.log(
      "No relevant applicants found after filtering by division and start month."
    );
    return null;
  }

  console.log(
    `Filtered ${allRelevantData.length} applicants after division and month filtering.`
  );

  // Step 4: Convert and normalize all relevant applicant data
  const normalizedAllData = allRelevantData.map((d) => {
    const college_major_score =
      college_major_mapping[d.division_request]?.[d.college_major] || 0.2;

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

  console.log(
    "Applicants data after initial normalization:",
    normalizedAllData
  );

  // Step 5: Group applicants by division and process each division separately
  const applicantsByDivision = {};
  normalizedAllData.forEach((applicant) => {
    const division = applicant.division_request;
    if (!applicantsByDivision[division]) {
      applicantsByDivision[division] = [];
    }
    applicantsByDivision[division].push(applicant);
  });

  console.log(
    "Applicants grouped by division:",
    Object.keys(applicantsByDivision).map(
      (div) => `${div}: ${applicantsByDivision[div].length} candidates`
    )
  );

  // Step 6: Process each division separately and select top candidates
  const selectedCandidates = [];
  const division_accepted = {};

  for (const [division, quota] of Object.entries(division_quota)) {
    if (
      quota <= 0 ||
      !college_major_mapping[division] ||
      !applicantsByDivision[division]
    ) {
      console.log(
        `Skipping division ${division}: quota=${quota}, has_mapping=${!!college_major_mapping[
          division
        ]}, has_applicants=${!!applicantsByDivision[division]}`
      );
      continue;
    }

    const divisionApplicants = applicantsByDivision[division];
    console.log(`\n=== Processing Division: ${division} ===`);
    console.log(`Candidates: ${divisionApplicants.length}, Quota: ${quota}`);

    // Process MOORA calculation for this division only
    const scoredDivisionData = processDivision(
      divisionApplicants,
      dataWeight,
      division
    );

    // Select top candidates for this division
    const candidatesForDivision = scoredDivisionData
      .sort((a, b) => b.total_score - a.total_score)
      .slice(0, quota);

    candidatesForDivision.forEach((candidate) => {
      division_accepted[candidate.id] = { division_category: division };
    });

    console.log(
      `Selected top ${candidatesForDivision.length} candidates for division ${division}`
    );
    console.log(
      `Selected candidates scores:`,
      candidatesForDivision.map((c) => ({
        id: c.id,
        name: c.name || "N/A",
        total_score: c.total_score.toFixed(4),
      }))
    );

    selectedCandidates.push(...candidatesForDivision);
  }

  // Step 7: Format and store results
  const formattedResults = selectedCandidates.map((selected) => ({
    id: uuidv4(),
    application_id: selected.id,
    accepted_division: division_accepted[selected.id].division_category,
    total_score: selected.total_score,
    benefit_score: selected.benefit_score,
    cost_score: selected.cost_score,
  }));

  console.log("Final formatted results:", formattedResults);

  if (formattedResults.length > 0) {
    await DSSRepo.saveDSS_Result(formattedResults);
    console.log("Saved DSS results to database.");
  }

  return formattedResults.length > 0 ? formattedResults : null;
};

exports.getDSS_Results = async ({
  month,
  year,
  page = 1,
  limit = 10,
  sort = "",
  sortBy = "",
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
