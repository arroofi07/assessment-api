module.exports = (sequelize, DataTypes) => {
  const Profil = sequelize.define("Profil", {
    // Atribut-atribut model Profil
    potoProfil: {
      type: DataTypes.STRING, // Ubah tipe data menjadi STRING
      allowNull: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Kolom-kolom lainnya sesuai kebutuhan Anda
  });

  Profil.associate = (models) => {
    Profil.belongsTo(models.Mahasiswa, {
      foreignKey: {
        name: "MahasiswaId",
        allowNull: true,
      },
      as: "Mahasiswa",
    });
  };

  return Profil;
};
