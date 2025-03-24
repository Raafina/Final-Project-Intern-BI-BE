const applicationUseCase = require('../usecases/application.usecases');

const yup = require('yup');

const applicationCreateUpdateSchema = yup.object().shape({
  full_name: yup.string().required('Nama lengkap wajib diisi'),
  university: yup.string().required('Asal Universitas wajib diisi'),
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
  phone: yup.string().required('No. HP wajib diisi'),
  intern_category: yup
    .string()
    .oneOf(['magang_KRS', 'magang_mandiri'], 'Tipe magang tidak valid')
    .required('Tipe magang wajib diisi'),
  semester: yup.number().min(1, 'Minimal Semester 4').required(),
  division_request: yup
    .string()
    .oneOf(
      [
        'moneter',
        'makroprudensial',
        'sistem_pembayaran',
        'pengelolaan_uang_rupiah',
        'humas',
        'internal',
      ],
      'Bidang Peminatan tidak valid'
    )
    .required('Bidang Peminatan wajib diisi'),
  IPK: yup.number().required('IPK wajib diisi'),
  college_major: yup
    .string()
    .oneOf(
      ['akuntansi', 'manajemen', 'IT', 'hukum', 'statistika', 'ilmu_sosial'],
      'Jurusan tidak valid'
    )
    .required('Jurusan wajib diisi'),
  start_month: yup.date().required('Tanggal rencana mulai wajib diisi'),
  end_month: yup
    .date()
    .min(yup.ref('start_month'), 'Tanggal selesai harus setelah tanggal mulai')
    .test(
      'max-6-months',
      'Tanggal selesai tidak boleh lebih dari 6 bulan dari tanggal mulai',
      function (value) {
        if (!this.parent.start_month || !value) return true;
        const start = new Date(this.parent.start_month);
        const maxEnd = new Date(start);
        maxEnd.setMonth(start.getMonth() + 6);

        return value <= maxEnd;
      }
    )
    .required('Tanggal rencana selesai wajib diisi'),
  google_drive_link: yup
    .string()
    .url('Harus berupa link valid')
    .required('Link Google Drive wajib diisi'),
  CV_score: yup.number().min(0).max(100).nullable(),
  motivation_letter_score: yup.number().min(0).max(100).nullable(),
});

exports.getApplications = async (req, res, next) => {
  try {
    const { month, year, page, limit, sort, sortBy, search } = req.query;
    const data = await applicationUseCase.getApplications({
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
        message: 'Data pendaftar tidak ditemukan',
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

exports.getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await applicationUseCase.getApplication(id);

    if (!data) {
      res.status(404).json({
        success: false,
        message: 'Data pendaftar tidak ditemukan',
        data,
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Data pendaftar ditemukan',
        data,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getApplicationByStartDate = async (req, res, next) => {
  try {
    const { start_month } = req.body;
    const data = await applicationUseCase.getApplicationByStartDate(
      start_month
    );

    if (!data) {
      res.status(404).json({
        success: false,
        message: 'Data pendaftar tidak ditemukan',
        data,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data pendaftar ditemukan',
      data,
    });
  } catch (error) {
    next(error);
  }
};
exports.createApplication = async (req, res, next) => {
  try {
    await applicationCreateUpdateSchema.validate(req.body, {
      abortEarly: false,
    });

    const data = await applicationUseCase.createApplication(req.body);

    res.status(201).json({
      success: true,
      message: 'Pendaftaran berhasil',
      data,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        success: false,
        message: error.errors,
        data: null,
      });
    }
    next(error);
  }
};

exports.updateAppliaction = async (req, res, next) => {
  try {
    await applicationCreateUpdateSchema.validate(req.body, {
      abortEarly: false,
    });

    const { id } = req.params;
    const data = await applicationUseCase.updateApplication(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Data pendaftar berhasil diperbarui',
      data,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        success: false,
        message: error.errors,
        data: null,
      });
    }
    next(error);
  }
};

exports.deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await applicationUseCase.deleteApplication(id);

    res.status(200).json({
      success: true,
      message: 'Data pendaftar berhasil dihapus',
      data,
    });
  } catch (error) {
    next(error);
  }
};
