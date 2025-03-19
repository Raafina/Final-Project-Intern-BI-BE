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
      full_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      start_month: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      accepted_division: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      application_id: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      IPK_score: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      intern_category_score: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      college_major_score: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      CV_score: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      motivation_letter_score: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      total_score: {
        type: Sequelize.FLOAT,
        allowNull: true,
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
