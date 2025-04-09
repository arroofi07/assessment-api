module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define("Admin", {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Admin;
};
