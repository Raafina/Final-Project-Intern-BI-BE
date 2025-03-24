const { login } = require('../usecases/auth.usecases');
const yup = require('yup');

const loginSchema = yup.object().shape({
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
  password: yup.string().required('Password wajib diisi'),
});

exports.login = async (req, res, next) => {
  try {
    await loginSchema.validate(req.body, {
      abortEarly: false,
    });

    const { email, password } = req.body;

    const data = await login(email, password);

    res.status(200).json({ data: data, message: 'Login sukses!' });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        success: false,
        message: error.errors[0],
        data: null,
      });
    }
    next(error);
  }
};
