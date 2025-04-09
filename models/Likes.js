module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define("Likes", {
    // Definisikan atribut-atribut model Likes di sini
    StoryId: {
      type: DataTypes.INTEGER,
      allowNull: true 
    },
    Warna: {
      type: DataTypes.BOOLEAN,
      allowNull: true   
    },
    // ...
  });

  Likes.associate = (models) => {
    Likes.belongsTo(models.Story, {
      foreignKey: {
        name: "StoryId",
        allowNull: true,
      },
      as: "Story",
    });
  };

  return Likes;
};
