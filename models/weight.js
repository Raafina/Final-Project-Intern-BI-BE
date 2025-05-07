"use strict";
const { Model } = require("sequelize");
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
      name: DataTypes.STRING,
      IPK_weight: DataTypes.FLOAT,
      intern_category_weight: DataTypes.FLOAT,
      college_major_weight: DataTypes.FLOAT,
      KRS_remaining_weight: DataTypes.FLOAT,
      CV_score_weight: DataTypes.FLOAT,
      motivation_letter_score_weight: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "weight",
    }
  );
  return weight;
};
