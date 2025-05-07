"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("weights", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      IPK_weight: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      intern_category_weight: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      college_major_weight: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      KRS_remaining_weight: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      CV_score_weight: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      motivation_letter_score_weight: {
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
    await queryInterface.dropTable("weights");
  },
};
