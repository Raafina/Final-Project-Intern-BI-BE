const { user } = require('../models');

exports.getUserByEmail = async (email) => {
  // get from db
  const data = await user.findAll({
    where: { email },
  });

  if (data.length > 0) {
    return data[0];
  }

  throw new Error('Akun tidak ditemukan');
};
