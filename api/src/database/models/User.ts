import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";
import Session from "./Session";

class User extends Model {
  declare id: string;
  declare firstName: string;
  declare lastName: string;
  declare username: string;
  declare password: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { sequelize }
);

User.hasMany(Session);
Session.belongsTo(User, {
  foreignKey: "userId",
});

export default User;
