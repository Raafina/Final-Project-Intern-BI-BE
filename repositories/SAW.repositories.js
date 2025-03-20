const { SAW_Result } = require('../models');

exports.getSAW_Results = async (rencana_mulai) => {
  const data = await SAW_Result.findAll({
    where: {
      rencana_mulai,
    },
  });
  return data;
};

exports.saveSAW_Result = async (payload) => {
  const data = await SAW_Result.bulkCreate(payload);
  return data;
};

exports.updateSAW_Result = async (application_id, payload) => {
  const data = await SAW_Result.update(payload, {
    where: {
      application_id,
    },
  });
  return data;
};

exports.deleteSAW_Result = async (application_id) => {
  const data = await SAW_Result.destroy({
    where: {
      application_id,
    },
  });

  return data;
};
