import * as SQLite from "expo-sqlite";

export let db = SQLite.openDatabase("muchatlu.db");

export const initializeDB = () => {
  db = SQLite.openDatabase("muchatlu.db");
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists message (id integer NOT NULL primary key AUTOINCREMENT,avatar_from text,avatar_to text,conversation_id integer,message text,timestamp text,user_id_from integer,user_id_to integer,username_from text,username_to text,data blob,from_read boolean,to_read boolean,type text)",
      [],
      (txObj, resultSet) => {},
      (txObj, error) => {
        console.log(error);
      }
    );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists conversation (id integer NOT NULL primary key AUTOINCREMENT,avatar_from text,avatar_to text,user_id_from integer,user_id_to integer,username_from text,username_to text)",
      [],
      (txObj, resultSet) => {},
      (txObj, error) => {
        console.log(error);
      }
    );
  });
};

export const insertMessage = (obj) => {
  db.transaction((tx) => {
    tx.executeSql(
      "insert into message(avatar_from,avatar_to,conversation_id,message,timestamp,user_id_from,user_id_to,username_from,username_to,data,from_read,to_read,type) values (?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        obj.avatarFrom,
        obj.avatarTo,
        obj.conversationId,
        obj.message,
        obj.timestamp,
        obj.userIdFrom,
        obj.userIdTo,
        obj.usernameFrom,
        obj.usernameTo,
        obj.data,
        obj.fromRead,
        obj.toRead,
        obj.type,
      ],
      (txObj, resultSet) => {
        console.log("result set ", resultSet);
      },
      (txObj, error) => {
        console.log(error);
      }
    );
  });
};

export const insertConversation = (obj) => {
  console.log(">>>>>>> insert convo ", obj);

  db.transaction((tx) => {
    tx.executeSql(
      "insert into conversation (avatar_from,avatar_to,user_id_from,user_id_to,username_from,username_to) values (?,?,?,?,?,?)",
      [
        obj.avatarFrom,
        obj.avatarTo,
        obj.userIdFrom,
        obj.userIdTo,
        obj.usernameFrom,
        obj.usernameTo,
      ],
      (txObj, resultSet) => {
        console.log("result set ", resultSet);
      },
      (txObj, error) => {
        console.log(error);
      }
    );
  });
};

export const getAllConversations = () => {
  console.log(">>>>>>> get allconvo ");

  db.transaction((tx) => {
    tx.executeSql(
      "select * from conversation",
      [],
      (txObj, resultSet) => {
        console.log("result set ", resultSet);
        return resultSet.rows._array;
      },
      (txObj, error) => {
        return error;
      }
    );
  });
};

export const getConversationById = (id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "select * from conversation where id = ?",
      [id],
      (txObj, resultSet) => {
        console.log("result set ", resultSet);
      },
      (txObj, error) => {
        console.log(error);
      }
    );
  });
};

export const getMessage = (id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "select * from message where id = ?",
      [id],
      (txObj, resultSet) => {
        console.log("result set ", resultSet);
      },
      (txObj, error) => {
        console.log(error);
      }
    );
  });
};

export const getMessagesByConversationId = (id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "select * from message where conversation_id = ?",
      [id],
      (txObj, resultSet) => {
        console.log("result set ", resultSet);
      },
      (txObj, error) => {
        console.log(error);
      }
    );
  });
};

export default {
  db,
  initializeDB,
  insertMessage,
  insertConversation,
  getAllConversations,
  getConversationById,
  getMessage,
  getMessagesByConversationId,
};
