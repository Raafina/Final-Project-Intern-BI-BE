const applicationUseCase = require('../usecase/application.usecase');

exports.getApplications = async (req, res, next) => {
  try {
    const data = await applicationUseCase.getApplications();
    res.status(200).json({
      status: 'true',
      message: 'Success',
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
