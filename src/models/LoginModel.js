const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({ // Modelo que o mongoose vai realizar : Até agora so senha e login
  email: { type: String, required: true }, 
  password: { type: String, required: true},
}); // Basicamente o Login pega a modelagem aqui recebida pra contruir um objeto que vai receber os parametros passados pelo os campo.

const LoginModel = mongoose.model('Login', LoginSchema); // LoginModel está meu banco de dados

class Login {
    constructor(body) {
        this.body = body;
        this.errors = []; // Controlar ou não se meu usuário pode ou não entrar na base de dados
        this.user = null;
    }

    // =============================================================Entra==================================>
    async login() {
        
        this.user = await LoginModel.findOne({ email: this.body.email }); // Aqui é o pulo do gata para procurar o usuário no banco de dados.
        this.valida(); // Passando por esse teste de validez
        if(this.errors.length > 0 ) return; // Vendo que não existe erros no login e senha
        if(!this.user) { 
            this.errors.push('Usuário não existe'); 
        return; 
        }

        

        /** O que acontece ? 
         * 
         *  Então existe uma funcionabilidade herdada por loginModel onde é possível veridicar[
         *  as strings existentes dentro de uma campo e-mail do BD. Assim voltando essa string
         *  parecida.
         *  
         * Login model é os modulos lá do meu banco de dados que já foi modelado pelo LoginSchema
         * sendo um desses parametros o email que já é conhecido pelo BD. (No caso o apelido do campo é login) mas a chave é email.
         * 
         * Então basicamente LoginModel herda de mongoose que já té modelado um methodo que procura nas suas chaves
         * (no caso aqui email, algo parecido com o que tem no campo "this.body") 
         * 
         */
                if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
                    this.errors.push('Senha Invalida');
                    this.user = null;
                    return;
                }
    }





    // =============================================================Registrar==============================>
    async register() { // Aqui registra o usuário
        this.valida();
        if(this.errors.length > 0) return; // Se meu erro estiver vázio então não existe erros
        
        await this.userExists();// Checando na base de dados se o existe usuário com o mesmo nome

        if (this.errors.length > 0) return; // SABER SE EXISTE ALGUM ERRO

        const salt = bcryptjs.genSaltSync(); // Gero um salt 
        this.body.password = bcryptjs.hashSync(this.body.password, salt); // Gero um hash da senha
        this.user = await LoginModel.create(this.body); // Caso o usuário seja criado ele podera ser acessado fora dos campos
    }

    // Varificando se o usuário já existe na base de dados, então precisa usar async

    async userExists(){
        const user = await LoginModel.findOne({email: this.body.email}); // Retorna o usuário ou Null
        if(user) this.errors.push('Usuário já existe') // Se o usuário existir, o erro emitido vai ter a menssagem dada pelo campo
    }

    valida(){

        // Validação dos campos =====>

        this.cleanUp(); // Limpar o objeto

        // O e-mail precisar ser válido =>
        if(!validator.isEmail(this.body.email)){ // Se não for um email válido || Usa uma biblioteca
            this.errors.push('E-mail inválido'); // Caso não seja valido ele preenche o campo error com a menssagem do escopo
        }
        //a senha precisa ter entre 4 e 50 caracter =>
        if(this.body.password.length < 4 || this.body.password.length >= 50){ // Verificação do password
            this.errors.push('A senha precisa ter entre 4 e 50 caracter');
        }
    
    }

    

    cleanUp(){ // Garantir que tudo que esteja dentro do body seja uma string
        for(const key in this.body){
           if(typeof this.body[key] !== 'string'){ // Tudo que não for uma string ele converte para um string vazia
               this.body[key] = ''; // atribui vazio
           }
        }

        // Garantir que so tenha os campos que presico nesse model => 
        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }
}


module.exports = Login;