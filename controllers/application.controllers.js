const applicationUseCase = require('../usecases/application.usecases');
const yup = require('yup');

const schema = yup.object().shape({
  nama_lengkap: yup.string().required('Nama lengkap wajib diisi'),
  universitas: yup.string().required('Asal Universitas wajib diisi'),
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
  no_hp: yup.string().required('No. HP wajib diisi'),
  tipe_magang: yup
    .string()
    .oneOf(['magang_KRS', 'magang_mandiri'], 'Tipe magang tidak valid')
    .required('Tipe magang wajib diisi'),
  semester: yup.number().min(1, 'Minimal Semester 4').required(),
  bidang_kerja: yup
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
  jurusan: yup
    .string()
    .oneOf(
      ['akuntansi', 'manajemen', 'IT', 'hukum', 'statistika', 'ilmu_sosial'],
      'Jurusan tidak valid'
    )
    .required('Jurusan wajib diisi'),
  rencana_mulai: yup.date().required('Tanggal rencana mulai wajib diisi'),
  rencana_selesai: yup
    .date()
    .min(
      yup.ref('rencana_mulai'),
      'Tanggal selesai harus setelah tanggal mulai'
    )
    .test(
      'max-6-months',
      'Tanggal selesai tidak boleh lebih dari 6 bulan dari tanggal mulai',
      function (value) {
        if (!this.parent.rencana_mulai || !value) return true;
        const mulai = new Date(this.parent.rencana_mulai);
        const maksimalSelesai = new Date(mulai);
        maksimalSelesai.setMonth(mulai.getMonth() + 6);

        return value <= maksimalSelesai;
      }
    )
    .required('Tanggal rencana selesai wajib diisi'),
  google_drive_link: yup
    .string()
    .url('Harus berupa link valid')
    .required('Link Google Drive wajib diisi'),
  skor_CV: yup.number().min(0).max(100).nullable(),
  skor_motivation_letter: yup.number().min(0).max(100).nullable(),
});

exports.getApplications = async (req, res, next) => {
  try {
    const { month, year, page, limit, sort, sortBy, search } = req.query;
    const applications = await applicationUseCase.getApplications({
      month: month ? parseInt(month) : null,
      year: year ? parseInt(year) : null,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort,
      sortBy,
      search,
    });

    res.status(200).json({
      success: true,
      message: 'Data pendaftar ditemukan',
      data: applications.data,
      pagination: applications.pagination,
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
      return next({
        statusCode: 404,
        success: false,
        message: 'Data pendaftar tidak ditemukan',
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
    const { rencana_mulai } = req.body;
    const results = await applicationUseCase.getApplicationByStartDate(
      rencana_mulai
    );

    res.status(200).json({
      message: 'Data berhasil dieksekusi dengan SAW!',
      data: results,
    });
  } catch (error) {
    next(error);
  }
};
exports.createApplication = async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });

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
        message: 'Pendaftaran gagal',
        errors: error.errors,
      });
    }
    next(error);
  }
};

exports.updateAppliaction = async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });

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
        message: 'Data gagal diperbarui',
        errors: error.errors,
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
