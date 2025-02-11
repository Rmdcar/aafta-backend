const Receita = require('../models/Receitas');



exports.registerContribution = async (req, res) => {
    try {
        const { name, mes, ano, dataRecebimento, valor, userId } = req.body;

        // Verifica se o userId foi passado
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const newContribution = new Receita({ 
            name, 
            mes, 
            ano, 
            dataRecebimento, 
            valor, 
            user: userId 
        });
        await newContribution.save();

        res.status(201).json({
            message: 'Receita cadastrada com sucesso',
            error: false,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Obter todas as contribuições
exports.getContributions = async (req, res) => {
    try {
        const contributions = await Receita.find({});
        res.status(200).json(contributions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.getContributionbyUser = async (req, res) => {
  const { id } = req.params; // Extrai o user da URL (note que o parâmetro é "id", não "user")

  console.log("ID do usuário recebido:", id); // Log para depuração

  try {
    // Busca todas as receitas associadas ao user
    const contributions = await Receita.find({ user: id });

    console.log("Resultado da busca:", contributions); // Log para depuração

    // Verifica se foram encontradas receitas para o user
    if (!contributions || contributions.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Nenhuma receita encontrada para este usuário",
      });
    }

    // Retorna as receitas encontradas
    res.status(200).json({
      error: false,
      data: contributions, // Retorna a lista de receitas
    });
  } catch (error) {
    // Captura erros inesperados
    console.error("Erro ao buscar receitas:", error); // Log do erro no console
    res.status(500).json({
      error: true,
      message: "Erro interno do servidor ao buscar receitas",
    });
  }
};



exports.editContributions = async (req, res) => {
    const { id } = req.params;
    try {
      const { name, mes, ano, dataRecebimento, valor } = req.body;
      const contributionEdited = {
        name, mes, ano, dataRecebimento, valor
      };
      const contribution = await Receita.findByIdAndUpdate(id, contributionEdited, {
        new: true,
      });
  
      if (!contribution) {
        res.status(404).json({ error: "receita não encontrada" });
      }
     
  
      res.status(201).json({
        message: "Receita editada com sucessos",
        error: false,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.deleteContribution = async (req, res) => {
    const { id } = req.params;
    try {
      const expense = await Receita.findByIdAndDelete(id);
      if (!expense) {
        res.status(404).json({ erro: "Receita não encontrada" });
      }
      res.status(200).send("Receita deletada");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };