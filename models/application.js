'use strict';
const { Model } = require('sequelize');
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
  application.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      nama_lengkap: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      universitas: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipe_magang: {
        type: DataTypes.ENUM('Magang Mandiri', 'Magang KRS'),
        allowNull: false,
      },
      semester: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      IPK: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      program_studi: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rencana_mulai: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      rencana_selesai: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      google_drive_link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      CV_score: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      motivation_letter_score: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'application',
    }
  );
  return application;
};
