const applicationUseCase = require('../usecases/application.usecases');

exports.getApplications = async (req, res, next) => {
  try {
    const data = await applicationUseCase.getApplications();
    res.status(200).json({
      status: true,
      message: 'Success',
      data: data,
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
