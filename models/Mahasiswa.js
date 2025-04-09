module.exports = (sequelize, DataTypes) => {
  const Mahasiswa = sequelize.define("Mahasiswa", {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kehadiran: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tugas: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    partisipasi: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    penugasan_online: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    quiz: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  Mahasiswa.associate = (models) => {
    Mahasiswa.hasMany(models.Story, {
      onDelete: "cascade",
    });
    Mahasiswa.hasMany(models.Likes, {
      onDelete: "cascade",
    });
    Mahasiswa.hasMany(models.Comments, {
      onDelete: "cascade",
    });
    Mahasiswa.hasMany(models.Profil, {
      onDelete: "cascade",
    });
  };

  return Mahasiswa;
};
