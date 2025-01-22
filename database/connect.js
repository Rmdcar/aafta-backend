const mongoose = require("mongoose");
require("dotenv").config();

const connectToDataBase = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.2sb15.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Conexão ao banco de dados realizada com sucesso");

  } catch (error) {
    console.error("Ocorreu erro ao conectar", error);
  }
};
module.exports = connectToDataBase;
