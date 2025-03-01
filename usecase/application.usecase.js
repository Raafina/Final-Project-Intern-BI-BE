const applicationRepo = require('../repository/application.repository');

exports.getApplications = async () => {
  const data = await applicationRepo.getApplications();
  return data;
};
