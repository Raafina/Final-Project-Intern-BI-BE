const { login } = require('../usecase/auth.usecase');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const data = await login(email, password);

    res.status(200).json({ data: data, message: 'Login sukses!' });
  } catch (error) {
    next(error);
  }
};
