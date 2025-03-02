const { getTokenFromHeaders, extractToken } = require('../helpers/auth.helper');
const { getUserProfile } = require('../usecases/auth.usecases');
exports.authMiddleware = (role) => async (req, res, next) => {
  try {
    const token = getTokenFromHeaders(req?.headers);

    const extractedToken = extractToken(token);

    const user = await getUserProfile(extractedToken?.id);

    if (!role.includes(user?.role)) {
      return next({
        message: 'Forbidden',
        statusCode: 403,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};
