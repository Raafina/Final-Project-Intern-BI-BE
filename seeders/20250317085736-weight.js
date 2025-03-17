'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const bobotData = Array.from({ length: 15 }, (_, i) => ({
      id: uuidv4(),
      nama: `Bobot ${i + 1}`,
      bobot_IPK: 0.3,
      bobot_jurusan: 0.1,
      bobot_kategori_magang: 0.2,
      bobot_skor_CV: 0.2,
      bobot_skor_motivation_letter: 0.2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('weights', bobotData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('weights', null, {});
  },
};
