'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('weights', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      nama: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      bobot_IPK: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      bobot_tipe_magang: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      bobot_jurusan: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      bobot_skor_CV: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      bobot_skor_motivation_letter: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('weights');
  },
};
