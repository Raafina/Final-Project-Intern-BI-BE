const weightUseCase = require("../usecases/weight.usecases");
const yup = require("yup");

const schema = yup.object().shape({
  name: yup.string().required("Nama bobot wajib diisi"),
  IPK_weight: yup.number().required("Bobot IPK wajib diisi"),
  intern_category_weight: yup.number("Bobot tipe magang wajib diisi"),
  college_major_weight: yup.number("Bobot jurusan wajib diisi"),
  CV_score_weight: yup.number("Bobot skor CV wajib diisi"),
  motivation_letter_score_weight: yup.number(
    "Bobot skor motivation letter Magang wajib diisi"
  ),
});

exports.getWeights = async (req, res, next) => {
  const { page, limit, sort, sortBy, search } = req.query;
  try {
    const weight = await weightUseCase.getWeights({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort,
      sortBy,
      search,
    });

    res.status(200).json({
      success: true,
      message: "Data bobot ditemukan",
      data: weight.data,
      pagination: weight.pagination,
    });
  } catch (error) {
    next(error);
  }
};

exports.getWeight = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await weightUseCase.getWeight(id);

    if (!data) {
      res.status(404).json({
        success: false,
        message: "Data bobot tidak ditemukan",
        data,
      });
    }

    res.status(200).json({
      success: true,
      message: "Data bobot ditemukan",
      data,
    });
  } catch (error) {
    next(error);
  }
};
exports.createWeight = async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });

    const data = await weightUseCase.createWeight(req.body);

    res.status(201).json({
      success: true,
      message: "Data bobot berhasil dibuat",
      data,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        success: false,
        data: null,
        message: error.errors,
      });
    }
    next(error);
  }
};

exports.updateWeight = async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });

    const { id } = req.params;
    const data = await weightUseCase.updateWeight(id, req.body);

    res.status(200).json({
      success: true,
      message: "Data bobot berhasil diperbarui",
      data,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        success: false,
        data: null,
        message: error.errors,
      });
    }
    next(error);
  }
};
exports.deleteWeight = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await weightUseCase.deleteWeight(id);

    res.status(200).json({
      success: true,
      message: "Data bobot berhasil dihapus",
      data,
    });
  } catch (error) {
    next(error);
  }
};
