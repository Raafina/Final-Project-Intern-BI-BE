'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class application extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  application.init({
    nama_lengkap: DataTypes.STRING,
    universitas: DataTypes.STRING,
    tipe_magang: DataTypes.STRING,
    semester: DataTypes.STRING,
    IPK: DataTypes.STRING,
    program_studi: DataTypes.STRING,
    NPWP: DataTypes.STRING,
    KTP: DataTypes.STRING,
    proposal: DataTypes.STRING,
    CV: DataTypes.STRING,
    surat_pengantar: DataTypes.STRING,
    buku_tabungan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'application',
  });
  return application;
};