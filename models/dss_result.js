"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DSS_Result extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DSS_Result.belongsTo(models.application, {
        foreignKey: "application_id",
        as: "application",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  DSS_Result.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      accepted_division: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      application_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      total_score: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "DSS_Result",
    }
  );
  return DSS_Result;
};
