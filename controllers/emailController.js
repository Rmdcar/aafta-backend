const nodemailer = require("nodemailer");
const Receita = require('../models/Receitas');
const User = require("../models/User");

// Configuração do transporte de e-mail
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'imoveisrenato2@gmail.com',  // Seu e-mail do Gmail
    pass: 'fxwl awag rwwq gxms'  // Senha do App ou a senha da conta
  }
});

exports.enviarEmail = async (req, res) => {
  const { userId, startDate, endDate } = req.body;

  try {
    // Converte as datas para o formato brasileiro (DD/MM/YYYY)
    const startDateFormatted = new Date(startDate).toLocaleDateString("pt-BR");
    const endDateFormatted = new Date(endDate).toLocaleDateString("pt-BR");

    // Busca as receitas do usuário no intervalo de datas
    const receitas = await Receita.find({
      user: userId,
      dataRecebimento: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    // Busca o e-mail do usuário
    const usuario = await User.findById(userId).select("email");

    // Verifica se o usuário foi encontrado
    if (!usuario) {
      return res.status(404).json({ error: true, message: "Usuário não encontrado." });
    }

    // Verifica se o usuário tem um e-mail cadastrado
    if (!usuario.email) {
      return res.status(400).json({ error: true, message: "E-mail do usuário não cadastrado." });
    }

    // Formata o conteúdo do e-mail como uma tabela HTML
    const emailContent = `
      <h3>Segue extrato de valores pagos perante Associação dos Auditores Fiscais de Anápolis no período de ${startDateFormatted} a ${endDateFormatted}</h3>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
        <thead>
          <tr>
            <th>Data</th>
            <th>Competência</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          ${receitas
            .map(
              (receita) => `
            <tr>
              <td>${new Date(receita.dataRecebimento).toLocaleDateString("pt-BR")}</td>
              <td>${receita.mes}/${receita.ano}</td>
              <td>R$ ${receita.valor.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <h3>Atenciosamente, </h3>
      <h3>Associação dos Auditores Fiscais de Anápolis</h3>
    
    `;

    // Configuração do e-mail
    const mailOptions = {
      from: "imoveisrenato2@gmail.com", // E-mail do remetente (deve ser o mesmo configurado no transporter)
      to: usuario.email, // E-mail do destinatário
      subject: "Extrato - AAFTA",
      html: emailContent, // Conteúdo do e-mail em HTML
    };

    // Envia o e-mail
    await transporter.sendMail(mailOptions);

    res.status(200).json({ error: false, message: "E-mail enviado com sucesso." });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.status(500).json({ error: true, message: "Erro ao enviar e-mail." });
  }
};