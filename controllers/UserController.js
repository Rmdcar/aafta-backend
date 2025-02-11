const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//registar usuário

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        error: true,
        message: "Este e-mail já está em uso",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "Usuário registrado com sucesso",
      error: false,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: true,
        message: "Usuário não encontrado",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        error: true,
        message: "Senha invalida",
      });
    }
    const token = jwt.sign({ id: user._id }, `${process.env.CHAVE_JWT}`, {
      expiresIn: "600s",
    });
    const usuario = user._id;
    res.status(200).json({ token, usuario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getUser = async (req, res) => {
  const {id} = req.params
  try {
    const user = await User.findById(id).select("-password")
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    res.status(200).send("Usuário deletado");
    if (!user) {
      res.status(404).json({ erro: "usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuários" });
  }
};

exports.editUser = async (req, res) => {
  const { id } = req.params;
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword };
    const user = await User.findByIdAndUpdate(id, newUser, { new: true });

    if (!user) {
      res.status(404).json({ erro: "usuário não encontrado" });
    }
    res.status(200).json({ message: "usuário atualizado com sucesso", user });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário:" });
  }
};
