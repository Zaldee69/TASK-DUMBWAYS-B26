// const multer = require("multer");
// let imageName;

// module.exports = () => {
//   const multer = require("multer");
//   let imageName;

//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "../public/uploads");
//     },
//     filename: (req, file, cb) => {
//       imageName = file.originalname;
//       cb(null, file.originalname);
//     },
//   });

//   const upload = multer({ storage: storage }).single("image");
// };
