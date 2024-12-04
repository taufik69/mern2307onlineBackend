const { dbConnection } = require("./src/Database/Index");
require("dotenv").config();
const { app } = require("./app");
dbConnection().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log("server Running on port 4000");
  });
});
