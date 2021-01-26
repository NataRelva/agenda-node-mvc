const express = require('express');// Cria um objeto express
const route = express.Router(); // Faz uma atribuição a uma váriavel recebendo o método Router()
const homeController = require('./src/controllers/homeController'); // Objeto homeController vai criar uma rota dento como funcionalidade apontada dentro do campo
const loginController = require('./src/controllers/loginController'); // Chamando o arquivo loginController
const paginaInicial = require('./src/controllers/pagInicial');
const contatoController = require('./src/controllers/contatoController');


const { loginRequired } = require('./src/middlewares/middleware') // Carrego os middlwares para que seja feito o tratamento em rota.


// Rotas da home
route.get(/** Vai receber como endereço -> */ '/agenda', homeController.index);

// Rotas de login
route.get(/** Nome da rota */ '/login/index', /** Quando solicitada ele vai direcionar -> */ loginController.index);
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);
route.get('/', paginaInicial.index);

// Rotas de contato

route.get('/contato/index', loginRequired, contatoController.index); // Posso adicionar rotinas a cada rota, no caso eu estou colocando um altenticador de sessão entre a rota.
route.post('/contato/register', loginRequired, contatoController.register); // Posso adicionar rotinas a cada rota, no caso eu estou colocando um altenticador de sessão entre a rota.
route.get('/contato/index/:id', loginRequired, contatoController.editIndex); // Posso adicionar rotinas a cada rota, no caso eu estou colocando um altenticador de sessão entre a rota.
route.post('/contato/edit/:id', loginRequired, contatoController.edit); // Rota que contato vai editar os contatos
route.get('/contato/delete/:id', loginRequired, contatoController.delete); // Rota que contato vai editar os contatos



module.exports = route;
