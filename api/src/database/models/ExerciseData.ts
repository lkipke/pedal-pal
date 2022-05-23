import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

class ExerciseData extends Model {
  declare id: string;
  declare sessionId: string;
  declare timestamp: string;
  declare heartRate: string;
  declare kmph: string;
  declare rpm: string;
  declare powerWatts: string;
  declare calories: string;
}

ExerciseData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    // sessionId: {
    //   type: DataTypes.TEXT,
    //   allowNull: false,
    //   references: {
    //     model: "Sessions",
    //     key: "id",
    //   },
    // },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    },
    heartRate: DataTypes.INTEGER,
    kmph: DataTypes.DOUBLE,
    rpm: DataTypes.DOUBLE,
    wattPower: DataTypes.DOUBLE,
    calories: DataTypes.DOUBLE,
  },
  { sequelize }
);

export default ExerciseData;
