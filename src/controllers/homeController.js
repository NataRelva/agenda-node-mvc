const Contato = require('../models/ContatoModel');

exports.index = async(req, res) => {
  const contato = await Contato.buscaContato();
  res.render('index', { contato });
};