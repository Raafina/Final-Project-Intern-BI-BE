const { login } = require('../usecases/auth.usecases');
const { z } = require('zod');

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email tidak boleh kosong' })
    .email({ message: 'Email tidak valid' }),
  password: z.string(),
});

exports.login = async (req, res, next) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        data: null,
        errors: result.error.errors[0].message,
      });
    }
    const { email, password } = req.body;

    const data = await login(email, password);

    res.status(200).json({ data: data, message: 'Login sukses!' });
  } catch (error) {
    next(error);
  }
};
