'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('applications', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      nama_lengkap: {
        type: Sequelize.STRING,
      },
      universitas: {
        type: Sequelize.STRING,
      },
      tipe_magang: {
        type: Sequelize.STRING,
      },
      semester: {
        type: Sequelize.STRING,
      },
      IPK: {
        type: Sequelize.STRING,
      },
      program_studi: {
        type: Sequelize.STRING,
      },
      rencana_mulai: {
        type: Sequelize.STRING,
      },
      rencana_selesai: {
        type: Sequelize.STRING,
      },
      google_drive_link: {
        type: Sequelize.STRING,
      },
      CV_score: {
        type: Sequelize.STRING,
      },
      motivation_letter_score: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('applications');
  },
};
