'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const existingEmails = new Set();
    const existingPhones = new Set();

    const generateUniqueEmail = () => {
      let email;
      do {
        email = `${uuidv4().slice(0, 8)}@example.com`;
      } while (existingEmails.has(email));
      existingEmails.add(email);
      return email;
    };

    const generateUniquePhone = () => {
      let phone;
      do {
        phone = `08${Math.floor(1000000000 + Math.random() * 900000000)}`;
      } while (existingPhones.has(phone));
      existingPhones.add(phone);
      return phone;
    };

    const getRandomTipeMagang = () => {
      const jurusanList = ['magang_mandiri', 'magang_KRS'];
      return jurusanList[Math.floor(Math.random() * jurusanList.length)];
    };

    const getRandomJurusan = () => {
      const jurusanList = [
        'akuntansi',
        'manajemen',
        'IT',
        'hukum',
        'statistika',
        'ilmu_sosial',
      ];
      return jurusanList[Math.floor(Math.random() * jurusanList.length)];
    };

    const getRandomBidangPeminatan = () => {
      const bidangPeminatanList = [
        'moneter',
        'makroprudensial',
        'sistem_pembayaran',
        'pengelolaan_uang_rupiah',
        'humas',
        'internal',
      ];
      return bidangPeminatanList[
        Math.floor(Math.random() * bidangPeminatanList.length)
      ];
    };

    const data = [
      // bulan 6`
      {
        id: uuidv4(),
        nama_lengkap: 'Muhammad Rafi',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Universitas Indonesia',
        tipe_magang: getRandomTipeMagang(),
        semester: '6',
        IPK: '3.90',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-06-01',
        rencana_selesai: '2025-08-30',
        google_drive_link: 'https://www.example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Siti Aisyah',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Institut Teknologi Bandung',
        tipe_magang: getRandomTipeMagang(),
        semester: '4',
        IPK: '3.75',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-06-10',
        rencana_selesai: '2025-08-31',
        google_drive_link: 'https://www.example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Ahmad Fauzan',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Universitas Gadjah Mada',
        tipe_magang: getRandomTipeMagang(),
        semester: '5',
        IPK: '3.85',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-06-15',
        rencana_selesai: '2025-09-01',
        google_drive_link: 'https://www.example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Nadia Putri',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Universitas Airlangga',
        tipe_magang: getRandomTipeMagang(),
        semester: '3',
        IPK: '3.60',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-06-20',
        rencana_selesai: '2025-09-15',
        google_drive_link: 'https://www.example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Rizky Maulana',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Universitas Brawijaya',
        tipe_magang: getRandomTipeMagang(),
        semester: '7',
        IPK: '3.92',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-06-25',
        rencana_selesai: '2025-09-30',
        google_drive_link: 'https://www.example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // bulan 7
      {
        id: uuidv4(),
        nama_lengkap: 'Abdurrahman Argobie',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Universitas Dian Nuswantoro',
        tipe_magang: getRandomTipeMagang(),
        semester: '5',
        IPK: '3.78',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-07-01',
        rencana_selesai: '2025-09-30',
        google_drive_link: 'https://www.example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Nasyawa Arofati Hakim',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Universitas Diponegoro',
        tipe_magang: getRandomTipeMagang(),
        semester: '3',
        IPK: '3.58',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-07-05',
        rencana_selesai: '2025-09-30',
        google_drive_link: 'https://www.example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Yusuf Hidayat',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Universitas Hasanuddin',
        tipe_magang: getRandomTipeMagang(),
        semester: '6',
        IPK: '3.88',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-07-10',
        rencana_selesai: '2025-09-30',
        google_drive_link: 'https://www.example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // bulan 8
      {
        id: uuidv4(),
        nama_lengkap: 'Resti Arrahmi',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Universitas Diponegoro',
        tipe_magang: getRandomTipeMagang(),
        semester: '3',
        IPK: '3.58',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-08-01',
        rencana_selesai: '2025-10-30',
        google_drive_link: 'https://www.example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Dimas Pratama',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Universitas Gadjah Mada',
        tipe_magang: getRandomTipeMagang(),
        semester: '5',
        IPK: '3.72',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-08-01',
        rencana_selesai: '2025-10-30',
        google_drive_link: 'www.example2.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Sarah Mahardika',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Institut Teknologi Bandung',
        tipe_magang: getRandomTipeMagang(),
        semester: '4',
        IPK: '3.65',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-08-01',
        rencana_selesai: '2025-10-30',
        google_drive_link: 'www.example3.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Rizky Aditya',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Universitas Indonesia',
        tipe_magang: getRandomTipeMagang(),
        semester: '6',
        IPK: '3.80',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-08-01',
        rencana_selesai: '2025-10-30',
        google_drive_link: 'www.example4.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Aulia Kartika',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Universitas Airlangga',
        tipe_magang: getRandomTipeMagang(),
        semester: '7',
        IPK: '3.67',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-08-01',
        rencana_selesai: '2025-10-30',
        google_drive_link: 'www.example5.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Fajar Setiawan',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Universitas Padjadjaran',
        tipe_magang: getRandomTipeMagang(),
        semester: '5',
        IPK: '3.74',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-08-01',
        rencana_selesai: '2025-10-30',
        google_drive_link: 'www.example6.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Siti Nurhaliza',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Universitas Brawijaya',
        tipe_magang: getRandomTipeMagang(),
        semester: '6',
        IPK: '3.61',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-08-01',
        rencana_selesai: '2025-10-30',
        google_drive_link: 'www.example7.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Hendri Saputra',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Universitas Sebelas Maret',
        tipe_magang: getRandomTipeMagang(),
        semester: '4',
        IPK: '3.69',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-08-01',
        rencana_selesai: '2025-10-30',
        google_drive_link: 'www.example8.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Nadya Ayu',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Universitas Negeri Yogyakarta',
        tipe_magang: getRandomTipeMagang(),
        semester: '5',
        IPK: '3.62',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-08-01',
        rencana_selesai: '2025-10-30',
        google_drive_link: 'www.example9.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        nama_lengkap: 'Andi Setyawan',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Universitas Hasanuddin',
        tipe_magang: getRandomTipeMagang(),
        semester: '6',
        IPK: '3.70',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-08-01',
        rencana_selesai: '2025-10-30',
        google_drive_link: 'www.example10.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // 🔹 bulan 9
      {
        id: uuidv4(),
        nama_lengkap: 'Lailatul Badriyah',
        email: generateUniqueEmail(),
        no_hp: generateUniquePhone(),
        universitas: 'Institut Teknologi Sepuluh Nopember',
        tipe_magang: getRandomTipeMagang(),
        semester: '7',
        IPK: '3.70',
        jurusan: getRandomJurusan(),
        bidang_kerja: getRandomBidangPeminatan(),
        rencana_mulai: '2025-09-01',
        rencana_selesai: '2025-11-30',
        google_drive_link: 'https://www.example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('applications', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('applications', null, {});
  },
};
