const applicationUseCase = require('../usecases/application.usecases');
const yup = require('yup');
exports.getApplications = async (req, res, next) => {
  try {
    // Pastikan req.query selalu memiliki nilai default agar tidak undefined
    const { month, year, page, limit, sort, sortBy, search } = req.query;
    console.log(month, 'month', year, 'year');
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
      data: applications.data,
      pagination: applications.pagination,
    });
  } catch (error) {
    next(error);
  }
};

exports.getApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await applicationUseCase.getApplication(id);

    if (!data) {
      return next({
        statusCode: 404,
        status: false,
        message: 'Pendaftar tidak ditemukan',
      });
    } else {
      res.status(200).json({
        message: 'Succes',
        data,
      });
    }
  } catch (error) {
    next(error);
  }
};
exports.createApplication = async (req, res, next) => {
  try {
    const schema = yup.object().shape({
      nama_lengkap: yup.string().required('Nama lengkap wajib diisi'),
      universitas: yup.string().required('Asal Universitas wajib diisi'),
      tipe_magang: yup
        .string()
        .oneOf(
          ['Magang KRS', 'Magang Mandiri'],
          'Tipe magang antara Magang KRS atau Magang Mandiri'
        )
        .required(),
      semester: yup.number().min(1, 'Minimal Semester 4').required(),
      IPK: yup.number().required(),
      program_studi: yup.string().required('Program studi wajib diisi'),
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
            maksimalSelesai.setMonth(mulai.getMonth() + 6); // Tambahkan 6 bulan

            return value <= maksimalSelesai; // Harus sebelum atau sama dengan tanggal maksimal
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
        message: 'Validasi gagal',
        errors: error.errors,
      });
    }
    next(error);
  }
};

exports.updateAppliaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nama_lengkap,
      universitas,
      tipe_magang,
      semester,
      IPK,
      program_studi,
      rencana_mulai,
      rencana_selesai,
      google_drive_link,
      CV_score,
      motivation_letter_score,
    } = req.body;

    const data = await applicationUseCase.updateApplication(id, {
      nama_lengkap,
      universitas,
      tipe_magang,
      semester,
      IPK,
      program_studi,
      rencana_mulai,
      rencana_selesai,
      google_drive_link,
      CV_score,
      motivation_letter_score,
    });

    console.log(data);

    res.status(200).json({
      message: 'Succes',
      data,
    });
  } catch (error) {
    next(error);
  }
};
exports.deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await applicationUseCase.deleteApplication(id);

    res.status(200).json({
      message: 'Succes',
      data,
    });
  } catch (error) {
    next(error);
  }
};
