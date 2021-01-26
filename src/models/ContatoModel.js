const mongoose = require('mongoose');
const validator = require('validator');

function Contato (body) { // Criando os formulários do banco de dados para salvar contato
    this.body = body;
    this.errors = []
    this.contato = null;
}

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' }, // Não precisa preencher esse campo e se não enviado ele salva como uma string vazia
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false, default: '' },
  criadoEm: { type: Date, default: Date.now }, // Quando o arquivo foi salvo, e salvar now.
});

const ContatoModel  = mongoose.model('Contato', ContatoSchema);

Contato.prototype.register = async function(){ 
  this.valida();

  if(this.errors.length > 0)return;

  this.contato = await ContatoModel.create(this.body);
};

Contato.prototype.valida = function (){

  // Validação dos campos =====>

  this.cleanUp(); // Limpar o objeto

  // Validação
  // O e-mail precisa ser válido
  if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
  if (!this.body.nome) this.errors.push('Nome é um campo obrigatório.');
  if (!this.body.email && !this.body.telefone) {
    this.errors.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone.');
  }

  /**
   * // O e-mail precisar ser válido =>
  if (!validator.isEmail(this.body.email)) { // Se não for um email válido || Usa uma biblioteca
    this.errors.push('E-mail inválido'); // Caso não seja valido ele preenche o campo error com a menssagem do escopo
  }
  if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail é inválido');
  if(this.body.nome) this.errors.push('Nome é uma campo obrigatório');
  if(this.body.email && !this.body.telefone){ this.errors.push('Nome é uma campo obrigatório')}}
   */

};



Contato.prototype.cleanUp = function (){ // Garantir que tudo que esteja dentro do body seja uma string
  for (const key in this.body) {
    if (typeof this.body[key] !== 'string') { // Tudo que não for uma string ele converte para um string vazia
      this.body[key] = ''; // atribui vazio
    }
  }

  // Garantir que so tenha os campos que presico nesse model => 
  this.body = { // Modelagem do Body para sabre as estrutura dele
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone,
  };
}

Contato.prototype.edit = async function(id) {  // Função construtora/ função asyncrona
  if(typeof id !== 'string') return;
  this.valida(); // Preciso validar tudo de novo dentro do prototypo da classe
  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {new: true}); // Procura o id e atualiza ele | quando atualizar quero que me retone os dados atualizados e não os antigos


};

// Metodos estaticos => Metodos que não vão para o prototype || Não vão acessar this valida, this errors

Contato.buscaPorId = async function(id) {
    if(typeof id !== 'string') return;
    const contato = await ContatoModel.findById(id);
    return contato;
};
Contato.buscaContato = async function() {
    const contatos = await ContatoModel.find() // Eu posso também fazer um filtro com esse method
      .sort({ criadoEm: -1 }); // Ordenação por ordem
    return contatos;
};

Contato.delete = async function(id) {
    if(typeof id !== 'string') return;
    const contato = await ContatoModel.findOneAndDelete({_id: id}) //Procura e deleta
    return contato;
};

module.exports = Contato;
