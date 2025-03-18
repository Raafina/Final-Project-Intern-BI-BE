const SAWUseCase = require('../usecases/SAW.usecases');

exports.calculate = async (req, res, next) => {
  try {
    const { rencana_mulai, weight_id, kebutuhan_bidang_kerja } = req.body;
    const results = await SAWUseCase.calculate(
      rencana_mulai,
      weight_id,
      kebutuhan_bidang_kerja
    );

    res
      .status(200)
      .json({ message: 'Data berhasil dieksekusi dengan SAW!', data: results });
  } catch (error) {
    next(error);
  }
};
