'use strict';
const { Model } = require('sequelize');
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
  SAW_Result.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_month: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      accepted_division: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      application_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      IPK: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      intern_category: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      college_major: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      IPK_score: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      intern_category_score: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      college_major_score: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      CV_score: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      motivation_letter_score: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      total_score: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'SAW_Result',
    }
  );
  return SAW_Result;
};
