"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("applications", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      full_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      phone: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      university: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      KRS_remaining: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      IPK: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      intern_category: {
        allowNull: false,
        type: Sequelize.ENUM(["Magang Mandiri", "Magang KRS"]),
      },
      college_major: {
        allowNull: false,
        type: Sequelize.ENUM([
          "Ekonomi",
          "Akuntansi",
          "Manajemen",
          "IT",
          "Hukum",
          "Statistika",
          "Ilmu Sosial",
        ]),
      },
      division_request: {
        allowNull: false,
        type: Sequelize.ENUM([
          "Moneter",
          "Makroprudensial",
          "Sistem Pembayaran",
          "Pengelolaan Uang Rupiah",
          "Humas",
          "Internal",
        ]),
      },
      CV_score: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      motivation_letter_score: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      semester: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      start_month: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      end_month: {
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
    await queryInterface.dropTable("applications");
  },
};
