"use strict";
const { col } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const weightData = Array.from({ length: 15 }, (_, i) => ({
      id: uuidv4(),
      name: `Bobot ${i + 1}`,
      IPK_weight: 10,
      college_major_weight: 10,
      intern_category_weight: 20,
      CV_score_weight: 20,
      KRS_remaining_weight: 10,
      motivation_letter_score_weight: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("weights", weightData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("weights", null, {});
  },
};
