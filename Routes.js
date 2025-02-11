const express = require('express');
const router = express.Router();
const userController = require('./controllers/UserController');
const contributionController = require('./controllers/ContributionController');
const expensesController = require('./controllers/ExpensesController');
const autentication = require('./middlewares/Auth')

// Rotas relacionadas aos usuários
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/getAllUsers', autentication.autenticacao, userController.getUsers);
router.delete('/deleteUser/:id', userController.deleteUser);
router.patch('/update/:id', userController.editUser);

// Rotas relacionadas às contribuições
router.post('/newcontribution', contributionController.registerContribution);
router.get('/getallcontributions',  contributionController.getContributions);
router.patch('/updatecontribution/:id', contributionController.editContributions)
router.delete('/deletecontribution/:id', contributionController.deleteContribution)

// Rotas relacionadas às despesas
router.post('/newexpense', expensesController.registerExpense);
router.get('/getallexpenses', expensesController.getExpenses)
router.patch('/updateexpense/:id', expensesController.editExpenses)
router.delete('/deleteexpense/:id', expensesController.deleteExpense)

module.exports = router;
