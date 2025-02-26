const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getUserByEmail } = require('../repository/auth.repository');

exports.login = async (email, password) => {
  // get the user
  let user = await getUserByEmail(email);
  if (!user) {
    throw new Error(`User is not found!`);
  }

  // compare the password
  const isValid = await bcrypt.compare(password, user?.password);
  if (!isValid) {
    throw new Error(`Wrong password!`);
  }

  // delete password
  if (user?.dataValues?.password) {
    delete user?.dataValues?.password;
  } else {
    delete user?.password;
  }

  // Create token
  const jwtPayload = {
    id: user.id,
  };

  const token = jsonwebtoken.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  // return the user data and the token
  const data = {
    user,
    token,
  };

  return data;
};
