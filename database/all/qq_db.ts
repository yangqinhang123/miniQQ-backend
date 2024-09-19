import Database from "../index";
import { DataTypes } from "sequelize";
import { user, contact_table } from "../../types/databases/qq_db";
interface Tables {
  user: user;
  contact_table: contact_table;
}

const QQ_DB = Database.factory<Tables>("QQ_DB", {
  user: {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INET(),
    },
    user_name: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
    create_time: {
      type: DataTypes.DATE(),
      allowNull: false,
    },
    user_pwd: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
    nickName: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
    user_email: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
    user_avatar: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
  },
  contact_table: {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INET(),
    },
    create_time: {
      type: DataTypes.DATE(),
      allowNull: false,
    },
    personA_user_name: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
    personB_user_name: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
  },
});

export default QQ_DB;
