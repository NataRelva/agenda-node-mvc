const Login = require('../models/LoginModel');

exports.index = (req , res) => { // Vai exporta uma função
    console.log(req.session.user);
    if(req.session.user) return res.render('login-logado')
    res.render('login'); // Que vai renderizar uma página login 

}

exports.register = async function(req, res) { // Criação de uruário
    
    try {
        const login = new Login(req.body);
        await login.register(); // Tentando registrar o usuário, sen não der ele volta para a página de registro com messagem de erros

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function () { // Garantir que a sessão seja salva para depois voltar para página de login
                return res.redirect('back'); // Agora que a sessão foi salva e esta segura para eu voltar, eu vou redirecionar a página para onde ela veio.
            });// Como ele vai retorna para a função de fora, então
            return; // retornamos para fora de novo 
        }
        req.flash('success', 'Usuário cadastrado com sucesso');
        req.session.save(function() { // Garantir que a sessão seja salva para depois voltar para página de login
            return res.redirect('back'); // Agora que a sessão foi salva e esta segura para eu voltar, eu vou redirecionar a página para onde ela veio.
        });// Como ele vai retorna para a função de fora, então 
    } catch(e) {
        console.log(e);
        return res.render('404');
    }
}


exports.login = async function (req, res) { // Criação de uruário

    try {
        const login = new Login(req.body); // Criação de um objeto com as propriedades de Login
        await login.login(); // Inicializa o metodo login dentro de do onjeto login

        if (login.errors.length > 0) { // ==> Verifica se existe algum erro atraveis do middleware
            req.flash('errors', login.errors); // Inicializa um processo de monstrar o erro em tela, sendo ele o login.errors
            req.session.save(function () { // Garantir que a sessão seja salva para depois voltar para página de login
                return res.redirect('back'); // Agora que a sessão foi salva e esta segura para eu voltar, eu vou redirecionar a página para onde ela veio.
            });// Como ele vai retorna para a função de fora, então
            return; // retornamos para fora de novo 
        }

        req.flash('success', 'Você entro no sistema');
        req.session.user = login.user; // Abrindo uma sessão para o usuário
        req.session.save(function () { // Garantir que a sessão seja salva para depois voltar para página de login
            return res.redirect('back'); // Agora que a sessão foi salva e esta segura para eu voltar, eu vou redirecionar a página para onde ela veio.
        });// Como ele vai retorna para a função de fora, então 
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
}

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}