const DSSUseCase = require("../usecases/DSS.usecases");

exports.calculate = async (req, res, next) => {
  try {
    const { year, month, weight_id, division_quota } = req.body;
    const results = await DSSUseCase.calculate(
      year,
      month,
      weight_id,
      division_quota
    );

    res.status(200).json({ message: "Data berhasil dihitung!", data: results });
  } catch (error) {
    next(error);
  }
};

exports.getDSS_Results = async (req, res, next) => {
  try {
    const { month, year, page, limit, sort, sortBy, search } = req.query;
    const data = await DSSUseCase.getDSS_Results({
      month: month ? parseInt(month) : null,
      year: year ? parseInt(year) : null,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort,
      sortBy,
      search,
    });

    if (!data.data.length) {
      return res.status(404).json({
        success: false,
        message: "Data hasil seleksi tidak ditemukan",
        data: data.data,
      });
    }

    res.status(200).json({
      success: true,
      message: "Data pendaftar ditemukan",
      data: data.data,
      pagination: data.pagination,
    });
  } catch (error) {
    next(error);
  }
};

exports.sendMail_Results = async (req, res, next) => {
  try {
    await DSSUseCase.sendMail_Results(req.body);

    res.status(200).json({
      success: true,
      message: "Email berhasil dikirim",
      data: [],
    });
  } catch (error) {
    next(error);
  }
};
