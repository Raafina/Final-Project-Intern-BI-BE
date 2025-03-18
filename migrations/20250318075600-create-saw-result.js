'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SAW_Results', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      nama_lengkap: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      no_hp: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      universitas: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      IPK: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      tipe_magang: {
        allowNull: false,
        type: Sequelize.ENUM(['magang_mandiri', 'magang_KRS']),
      },
      jurusan: {
        allowNull: false,
        type: Sequelize.ENUM([
          'akuntansi',
          'manajemen',
          'IT',
          'hukum',
          'statistika',
          'ilmu_sosial',
        ]),
      },
      bidang_kerja: {
        allowNull: false,
        type: Sequelize.ENUM([
          'moneter',
          'makroprudensial',
          'sistem_pembayaran',
          'pengelolaan_uang_rupiah',
          'humas',
          'internal',
        ]),
      },
      skor_CV: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      skor_motivation_letter: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      semester: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      rencana_mulai: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      rencana_selesai: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      google_drive_link: {
        allowNull: false,
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
    await queryInterface.dropTable('SAW_Results');
  },
};
