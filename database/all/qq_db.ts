import Database from "../index";
import { DataTypes } from "sequelize";
import { user, contact_table, chat_history } from "../../types/databases/qq_db";
interface Tables {
  user: user;
  contact_table: contact_table;
  chat_history: chat_history;
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
    permission: {
      allowNull: false,
      type: DataTypes.TINYINT(),
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
  chat_history: {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.CHAR(255),
    },
    create_time: {
      type: DataTypes.DATE(),
      allowNull: false,
    },
    from: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
    to: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
    msg: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
    is_del: {
      allowNull: false,
      type: DataTypes.TINYINT(),
    },
  },
});

export default QQ_DB;
