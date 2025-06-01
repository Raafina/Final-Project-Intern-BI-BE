"use strict";
const { col } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const weightData = [
      {
        id: uuidv4(),
        name: "Prioritas Kategori Magang",
        intern_category_weight: 30,
        IPK_weight: 25,
        CV_score_weight: 20,
        motivation_letter_score_weight: 15,
        college_major_weight: 7,
        KRS_remaining_weight: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Prioritas IPK",
        IPK_weight: 30,
        intern_category_weight: 25,
        CV_score_weight: 20,
        motivation_letter_score_weight: 15,
        college_major_weight: 7,
        KRS_remaining_weight: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("weights", weightData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("weights", null, {});
  },
};
