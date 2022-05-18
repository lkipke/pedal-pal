import { Sequelize } from 'sequelize';
import config from './config';

const controller = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    port: parseInt(config.port),
    pool: config.pool,
});

export default controller;
