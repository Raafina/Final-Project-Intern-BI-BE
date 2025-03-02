'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert('applications', [
      {
        id: uuidv4(),
        nama_lengkap: 'Abdurrahman Argobie',
        universitas: 'Universitas Dian Nuswantoro',
        tipe_magang: 'Magang KRS',
        semester: '5',
        IPK: '3.78',
        program_studi: 'Teknik Informatika',
        rencana_mulai: '2025-07-01',
        rencana_selesai: '2025-09-30',
        NPWP: null,
        KTP: null,
        proposal: null,
        CV: null,
        surat_pengantar: null,
        buku_tabungan: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Nasyawa Arofati Hakim',
        universitas: 'Universitas Diponegoro',
        tipe_magang: 'Magang KRS',
        semester: '3',
        IPK: '3.58',
        program_studi: 'Hubungan Masyarakat',
        rencana_mulai: '2025-07-01',
        rencana_selesai: '2025-09-30',
        NPWP: null,
        KTP: null,
        proposal: null,
        CV: null,
        surat_pengantar: null,
        buku_tabungan: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
