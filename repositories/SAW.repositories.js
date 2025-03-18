const { SAW_Result } = require('../models');

exports.saveSAW_Result = async (payload) => {
  const data = await SAW_Result.bulkCreate(payload);

  return data;
};
