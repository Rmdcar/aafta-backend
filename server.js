const dotenv = require('dotenv')
dotenv.config()
const connectToDataBase  = require('./database/connect')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const userRoutes = require('./Routes')
const emailRoutes = require('./Routes')


const app = express()

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    app.use(cors());
    next();
})

app.use(bodyParser.json()) 

connectToDataBase()

app.use((req, res, next) => {
  console.log(`Tipo de requisição: ${req.method}`);
  console.log(`Tipo de requisição: ${req.headers["content-type"]}`);
  console.log(`Horário da requisição: ${new Date()}`);
  
  // Filtrar informações sensíveis do req.body
  const safeBody = { ...req.body };
  if (safeBody.password) delete safeBody.password; // Remove o campo "password"

  console.log(`Corpo da requisição:`, safeBody);
  next();
});

// Middleware para processar JSON
app.use(express.json());

// Usa as rotas de e-mail
app.use("/api", emailRoutes);



const PORT = 3000

app.use('/', userRoutes)

app.listen(PORT, ()=> {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
}
)