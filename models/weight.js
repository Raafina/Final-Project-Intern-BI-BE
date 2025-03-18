'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class weight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  weight.init(
    {
      nama: DataTypes.STRING,
      bobot_IPK: DataTypes.FLOAT,
      bobot_tipe_magang: DataTypes.FLOAT,
      bobot_jurusan: DataTypes.FLOAT,
      bobot_skor_CV: DataTypes.FLOAT,
      bobot_skor_motivation_letter: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'weight',
    }
  );
  return weight;
};
