import Sequelize from 'sequelize';
import 'dotenv/config';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import Growdever from '../app/models/Growdever';
import GrowdevClass from '../app/models/GrowdevClass';
import ClassGrowdever from '../app/models/ClassGrowdever';

const models = [User, Growdever, GrowdevClass, ClassGrowdever];

class DataBase {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(process.env.DATABASE_URL, databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new DataBase();
