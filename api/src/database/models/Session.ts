import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";
import ExerciseData from "./ExerciseData";

class Session extends Model {
  declare id: string;
  declare name: string;
  declare userId: string;
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // userId: {
    //   type: DataTypes.TEXT,
    //   allowNull: false,
    //   references: {
    //     model: "Users",
    //     key: "id",
    //   },
    // },
  },
  { sequelize }
);

Session.hasMany(ExerciseData);
ExerciseData.belongsTo(Session, {
  foreignKey: "sessionId",
});

export default Session;
