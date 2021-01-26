exports.middlewareGlobal = (req, res, next) => {
  res.locals.errors = req.flash('errors'); // Sempre em todas as páginas vamos ter disponivel esse local erro || req.flash('errors') vai capturar os erros e mandar em dela atraves de middleware
  res.locals.success = req.flash('success'); // Sempre em todas as páginas vamos ter disponivel esse local erro || req.flash('errors') vai capturar os erros e mandar em dela atraves de middleware
  res.locals.user = req.session.user;
  next();
};

exports.checkCsrfError = (err, req, res, next) => {
  if(err) {
    return res.render('404');
  }

  next();
};

exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

exports.loginRequired = (req, res, next) => {
  if(!req.session.user) { // usuário não esta longado
    req.flash('errors', 'Você precisa fazer login.'); // Eu relato que isso gera um errors e depois passa a menssagem que vai aparecer em vermelho rapidamente na tela
    req.session.save(()=> { // Recebo uma função de callback para que seja feito o retorno ao estado anterior
      res.redirect('/'); // redireciono para home
    }); // Depois eu salvo a sessão para que possa ser feito o loguin depois
    return;
  }
  next() // Se chegou até aqui é porque o usuário esta longado.
}
