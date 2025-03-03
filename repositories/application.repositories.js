const { application } = require('../models');

exports.getApplications = async () => {
  const data = await application.findAll();

  return data;
};

exports.getApplication = async (id) => {
  const data = await application.findAll({
    where: {
      id,
    },
  });

  if (!data.length) {
    return 'Data pendaftar tidak ditemukan';
  } else {
    return data;
  }
};

exports.updateApplication = async (id, payload) => {
  console.log('payload repo', payload);
  await application.update(payload, {
    where: { id },
  });

  const data = await application.findAll({
    where: {
      id,
    },
  });

  return data;
};

exports.deleteApplication = async (id) => {
  await application.destroy({
    where: { id },
  });

  return null;
};
