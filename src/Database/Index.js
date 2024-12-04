const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const databaseInstace = mongoose.connect(
      "mongodb+srv://taufikcitbd:uMjCrW1kXe141dfQ@cluster0.60kn3.mongodb.net/esmern2307Backend"
    );
    if (databaseInstace) {
      console.log("Database Connected");
    }
  } catch (error) {
    console.log("From Database Connection Error ", error);
  }
};

module.exports = { dbConnection };
