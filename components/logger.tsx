// // import * as FileSystem from 'expo-file-system';
// import { FileSystem } from "expo";
// import { fileAsyncTransport, logger } from "react-native-logs";

// let today = new Date();
// let date = today.getDate();
// let month = today.getMonth() + 1;
// let year = today.getFullYear();

// const defaultConfig = {
//   severity: "debug",
//   transport: fileAsyncTransport,
//   transportOptions: {
//     color: "ansi", // custom option that color consoleTransport logs
//     FS: FileSystem,
//     filePath:FileSystem.documentDirectory,
//     fileLogName:`logs_${date}-${month}-${year}`, // Create a new file every day
//   },
//   levels: {
//     debug: 0,
//     info: 1,
//     warn: 2,
//     error: 3,
//   },
//   async: true,
//   printLevel: true,
//   printDate: true,
//   enabled: true,
// };

// var LOG = logger.createLogger(defaultConfig);

// export { LOG };

