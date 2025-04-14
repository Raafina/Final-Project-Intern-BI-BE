"use strict";
const { col } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const weightData = Array.from({ length: 15 }, (_, i) => ({
      id: uuidv4(),
      name: `Bobot ${i + 1}`,
      IPK_weight: 0.3,
      college_major_weight: 0.1,
      intern_category_weight: 0.2,
      CV_score_weight: 0.2,
      motivation_letter_score_weight: 0.2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("weights", weightData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("weights", null, {});
  },
};
