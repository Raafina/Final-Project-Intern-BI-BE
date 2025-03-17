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
      jurusan: {
        type: DataTypes.ENUM(
          'Ekonomi',
          'Akuntansi',
          'Manajemen',
          'IT',
          'Hukum',
          'Statistika'
        ),
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
      skor_CV: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      skor_motivation_letter: {
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
