import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';
import ExerciseData from './ExerciseData';

class Session extends Model {
  declare id: string;
  declare name: string;
  declare UserId: string;
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
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize }
);

Session.hasMany(ExerciseData);
ExerciseData.belongsTo(Session);

export default Session;
