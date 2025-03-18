'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SAW_Result extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SAW_Result.init({
    nama_lengkap: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SAW_Result',
  });
  return SAW_Result;
};