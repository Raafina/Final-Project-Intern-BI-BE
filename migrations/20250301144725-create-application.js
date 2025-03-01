'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('applications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_lengkap: {
        type: Sequelize.STRING
      },
      universitas: {
        type: Sequelize.STRING
      },
      tipe_magang: {
        type: Sequelize.STRING
      },
      semester: {
        type: Sequelize.STRING
      },
      IPK: {
        type: Sequelize.STRING
      },
      program_studi: {
        type: Sequelize.STRING
      },
      NPWP: {
        type: Sequelize.STRING
      },
      KTP: {
        type: Sequelize.STRING
      },
      proposal: {
        type: Sequelize.STRING
      },
      CV: {
        type: Sequelize.STRING
      },
      surat_pengantar: {
        type: Sequelize.STRING
      },
      buku_tabungan: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('applications');
  }
};