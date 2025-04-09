const Likes = require("./Likes");

module.exports = (sequelize, DataTypes) => {
  const Story = sequelize.define("Story", {
    story: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tagar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nama: {
      type: DataTypes.STRING, // Ganti dengan tipe data yang sesuai
      allowNull: true,
    },
  });


  Story.associate = (models) => {
    Story.belongsTo(models.Mahasiswa, {
      foreignKey: {
        name: "MahasiswaId",
        allowNull: true,
      },
      as: "Mahasiswa",
    });
    Story.hasMany(models.Likes, {
      onDelete: "cascade",
    });
    Story.hasMany(models.Comments, {
      onDelete: "cascade",
    });
  };

  return Story;
};
