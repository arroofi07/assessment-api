const { Sequelize } = require('sequelize');

// Inisialisasi objek Sequelize
const sequelize = new Sequelize({
  dialect: 'mysql',
  storage: '../models', // Ganti dengan path dan nama file database yang sesuai
});

// Fungsi untuk menguji koneksi ke database
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Koneksi ke database berhasil!');
  } catch (error) {
    console.error('Koneksi ke database gagal:', error);
  }
}

// Eksport objek Sequelize
module.exports = { sequelize, testConnection };
