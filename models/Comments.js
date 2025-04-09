module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    // Definisikan atribut-atribut model Comments di sini
    Comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    StoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Nama: {
      type: DataTypes.STRING, // Ganti dengan tipe data yang sesuai
      allowNull: true,
    },
    // ...
  });

  Comments.associate = (models) => {
    Comments.belongsTo(models.Story, {
      foreignKey: {
        name: "StoryId",
        allowNull: true,
      },
      as: "Story",
    }),
      Comments.belongsTo(models.Mahasiswa, {
        foreignKey: {
          name: "MahasiswaId",
          allowNull: true,
        },
        as: "Mahasiswa",
      });
  };

  return Comments;
};
