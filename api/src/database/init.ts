import sequelize from "./sequelize";
import "./models/User";

export default async () => {
    let forceReset = process.env.FORCE_DB_RESET === 'true';
    await sequelize.sync({ force: forceReset })
}