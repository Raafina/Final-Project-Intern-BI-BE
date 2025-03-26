const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  getUserByEmail,
  getUserById,
} = require('../repositories/auth.repositories');

exports.login = async (email, password) => {
  let user = await getUserByEmail(email);
  const isValid = await bcrypt.compare(password, user?.password);
  if (!user || !isValid) {
    throw new Error(`Email atau Password salah!`);
  }

  if (user?.dataValues?.password) {
    delete user?.dataValues?.password;
  } else {
    delete user?.password;
  }

  const jwtPayload = {
    id: user.id,
  };

  const token = jsonwebtoken.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: '20h',
  });

  const data = {
    user,
    token,
  };

  return data;
};

exports.getUserProfile = async (id) => {
  let data = await getUserById(id);
  if (!data) {
    throw new Error('Akun tidak ditemukan');
  } else if (data?.dataValues?.password) {
    delete data?.dataValues?.password;
  } else {
    delete data?.password;
  }
  return data;
};
