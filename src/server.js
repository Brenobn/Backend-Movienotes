require("express-async-errors");
require("dotenv/config");

const migrationRun =  require("./database/sqlite/migrations")
const AppError = require("./utils/AppError")
const uploadConfig = require("./configs/upload");

const cors = require("cors");
const express = require("express"); 
const Routes = require("./routes")

migrationRun();

const app = express();
app.use(cors());
app.use(express.json()); 

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(Routes)

app.use((error, request, response, next) => {
 if(error instanceof AppError) {
  return response.status(error.statusCode).json({
     status: "error",
     message: error.message,
  });
 }

  console.error(error);
  
 return response.status(500).json({
  status: "error",
  message: "internal server error ",
 }) 

});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}` ));