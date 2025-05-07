const weightUseCase = require("../usecases/weight.usecases");
const yup = require("yup");

const weightCreateUpdateSchema = yup
  .object()
  .shape({
    name: yup.string().required("Nama bobot wajib diisi"),
    IPK_weight: yup
      .number()
      .required("Bobot IPK wajib diisi")
      .min(0, "Bobot IPK tidak boleh kurang dari 0")
      .max(1, "Bobot IPK tidak boleh lebih dari 1"),
    intern_category_weight: yup
      .number()
      .required("Bobot tipe magang wajib diisi")
      .min(0, "Bobot tipe magang tidak boleh kurang dari 0")
      .max(1, "Bobot tipe magang tidak boleh lebih dari 1"),
    college_major_weight: yup
      .number()
      .required("Bobot jurusan wajib diisi")
      .min(0, "Bobot jurusan tidak boleh kurang dari 0")
      .max(1, "Bobot jurusan tidak boleh lebih dari 1"),
    KRS_remaining_weight: yup
      .number()
      .required("Bobot sisa KRS wajib diisi")
      .min(0, "Bobot sisa KRS tidak boleh kurang dari 0")
      .max(1, "Bobot sisa KRS tidak boleh lebih dari 1"),
    CV_score_weight: yup
      .number()
      .required("Bobot skor CV wajib diisi")
      .min(0, "Bobot skor CV tidak boleh kurang dari 0")
      .max(1, "Bobot skor CV tidak boleh lebih dari 1"),
    motivation_letter_score_weight: yup
      .number()
      .required("Bobot skor motivation letter wajib diisi")
      .min(0, "Bobot motivation letter tidak boleh kurang dari 0")
      .max(1, "Bobot motivation letter tidak boleh lebih dari 1"),
  })
  .test(
    "total-weight",
    "Total bobot tidak boleh lebih dari 1",
    function (values) {
      const {
        IPK_weight = 0,
        intern_category_weight = 0,
        college_major_weight = 0,
        KRS_remaining_weight = 0,
        CV_score_weight = 0,
        motivation_letter_score_weight = 0,
      } = values;

      const total =
        IPK_weight +
        intern_category_weight +
        college_major_weight +
        KRS_remaining_weight +
        CV_score_weight +
        motivation_letter_score_weight;
      if (total < 1) {
        return this.createError({
          path: "totalWeight",
          message: "Total bobot tidak boleh kurang dari 1",
        });
      }
      if (total > 1) {
        return this.createError({
          path: "totalWeight",
          message: "Total bobot tidak boleh lebih dari 1",
        });
      }

      return true;
    }
  );

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
    await weightCreateUpdateSchema.validate(req.body, { abortEarly: false });

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
    await weightCreateUpdateSchema.validate(req.body, { abortEarly: false });

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
