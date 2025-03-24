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

exports.getSAW_Results = async (req, res, next) => {
  try {
    const { month, year, page, limit, sort, sortBy, search } = req.query;
    const data = await SAWUseCase.getSAW_Results({
      month: month ? parseInt(month) : null,
      year: year ? parseInt(year) : null,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort,
      sortBy,
      search,
    });

    if (!data.data.length) {
      res.status(404).json({
        success: false,
        message: 'Data hasil seleksi tidak ditemukan',
        data: data.data,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data pendaftar ditemukan',
      data: data.data,
      pagination: data.pagination,
    });
  } catch (error) {
    next(error);
  }
};
