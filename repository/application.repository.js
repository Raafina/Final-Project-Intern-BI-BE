const { application } = require('../models');

const getApplications = async () => {
  const data = await application.findAll();
  return data;
};

module.exports = {
  getApplications,
};
