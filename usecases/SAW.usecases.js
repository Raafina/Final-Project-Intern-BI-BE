const applicationRepo = require('../repositories/application.repositories');
const weightRepo = require('../repositories/weight.repositories');

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

const normalizeIPK = (ipk) => {
  return ipk / 4.0;
};

exports.calculate = async (
  rencana_mulai,
  weight_id,
  kebutuhan_bidang_kerja
) => {
  let dataApplication = await applicationRepo.getApplicationByStartDate(
    rencana_mulai
  );

  let dataWeight = await weightRepo.getWeightById(weight_id);
  if (!dataWeight || dataApplication.length === 0) return [];

  let results = [];

  for (const [bidang, jumlah] of Object.entries(kebutuhan_bidang_kerja)) {
    if (jumlah === 0 || !jurusanMapping[bidang]) continue;

    let dataApplicationFilter = dataApplication.filter(
      (item) => item.bidang_kerja === bidang
    );

    if (dataApplicationFilter.length < jumlah) {
      let dataApplicationAdditional = dataApplication.filter(
        (data) =>
          !dataApplicationFilter.includes(data) &&
          jurusanMapping[bidang][data.jurusan.toLowerCase()]
      );
      dataApplicationFilter = [
        ...dataApplicationFilter,
        ...dataApplicationAdditional,
      ].slice(0, jumlah);
    }

    let normalizedData = dataApplicationFilter.map((d) => ({
      ...d,
      ipk: normalizeIPK(d.ipk),
      kategori: kategoriMagangMapping[d.tipe_magang.toLowerCase()] || 0.5,
      jurusan: jurusanMapping[bidang]?.[d.jurusan.toLowerCase()] || 0.2,
      skor_cv: (d.skor_cv ?? 0) / 100,
      skor_motivation_letter: (d.skor_motivation_letter ?? 0) / 100,
    }));

    let rankedData = normalizedData
      .map((d) => ({
        ...d,
        score:
          d.ipk * dataWeight.bobot_IPK +
          d.tipe_magang * dataWeight.bobot_tipe_magang +
          d.jurusan * dataWeight.bobot_jurusan +
          d.skor_cv * dataWeight.bobot_skor_CV +
          d.skor_motivation_letter * dataWeight.bobot_skor_motivation_letter,
      }))
      .sort((a, b) => b.score - a.score);

    let selected = rankedData.slice(0, jumlah);
    results.push(...selected);
  }

  return results;
};
