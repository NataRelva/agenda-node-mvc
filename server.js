require('dotenv').config(); // Carrega o dorenv realcionado as variáveis de ambiente de desenvolvimento que não pode ser colocando em repositório.
const express = require('express'); //
const app = express();// 2 e 3 Inicia o app do Express 
const mongoose = require('mongoose');//Criação de um objeto mongoose que pode ser inicializado atraves de um method interno

// =====>Ele fara a modelagem do banco de dados e garanti que os dados salvos no bancos de dados seja realmente a forma que eu queria que seja salvo 
mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })//Banco de dados é conectado e configurado utilziando uma chava dentro de .env de nome CONNECTIONSTRING e retorna uma promisse que eu configurei para emitir um sinal a ser escutado.
  .then(() => {// Promeça cumprida com sucesso pode sequir o fluxo desejado.
    app.emit('pronto');// Emite um sinal de pronto no formato broadcast
  })//
  .catch(e => console.log(e));// Caso de algum erro quero saber em terminal o que hove.

//=================================================================================================
  
const session = require('express-session');// Tratamento da sessões e suas propriedades
const MongoStore = require('connect-mongo')(session); // Responsável por modela meu BD
const flash = require('connect-flash'); // Responsavel por enviar menssagem que se auto destroi ao usuário
const routes = require('./routes');// Responsavel por realizar os trabalhos de rotas
const path = require('path');// Responsavel ao qual gera uma garantia de endereços absolutos de determinado arquivo
const helmet = require('helmet'); // Responsavel por tratar a segurança das rotas e requisição do sistema
const csrf = require('csurf'); // Responsavel pela segurança das requisições não reslizada pelo usuário
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware'); // Criação de objetos middlewares 

app.use(helmet()); // Inicializando o helmet

// AREA DE RECONHECIMENTO DE REQUISIÇÕES ==>
app.use(express.urlencoded({ extended: true })); // Esta é uma função de middleware integrada no Express. Ele analisa as solicitações recebidas com urlencoded codificadas por url || Trocando a miudos, ele faz o servidor analizar as requisições de acordo com os parametros nele atribuídos => Esta opção permite escolher entre analisar os dados codificados por URL com a biblioteca querystring (quando falso) ou a biblioteca qs (quando verdadeiro).
app.use(express.json());// Resolhece as resquisições vinda por json
app.use(express.static(path.resolve(__dirname, 'public')));// reconhece os objetos staticos tal como imgagens e texto dentro da aplicação
// <== AREA DE RECONHECIMENTO DE REQUISIÇÕES

const sessionOptions = session({
  secret: 'akasdfj0út23453456+54qt23qv  qwf qwer qwer qewr asdasdasda a6()',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: false,
  cookie: {                           // Duração do tempo de sessão atravez do tempo de duração da validade de um cookie
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});
app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views')); // Localização dos Viwes da aplicação assim sempre que uma rota procura algum tamplate ele vai buscar no local expecificado aqui
app.set('view engine', 'ejs');// O servidor vai entender que as instruções de Viwes vão ser quidaas astraves de um documento ejs

app.use(csrf());

// Nossos próprios middlewares
app.use(middlewareGlobal);// Inicialização
app.use(checkCsrfError);// Inicialização
app.use(csrfMiddleware);
app.use(routes);// Inicialização

app.on('pronto', () => { // Escuta
  app.listen(3001, () => {
    console.log('Acessar http://localhost:3000');
    console.log('Servidor executando na porta 3000');
  });
});
