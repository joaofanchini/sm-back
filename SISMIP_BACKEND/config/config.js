const env = process.env.NODE_ENV || 'dev';

const config = () =>{
    switch (env){
        case 'dev':
            return{
            bd_string: 'mongodb+srv://user_adm:TjZQmAcPQm5HxNlY@sismip-db-iyerz.gcp.mongodb.net/dev?retryWrites=true',
            jwt_pass: 'zJ$&FvsWlE',
            jwt_expires_in: '1h'
            }

        case 'hml':
            return{
                bd_string: 'mongodb+srv://user_adm:TjZQmAcPQm5HxNlY@sismip-db-iyerz.gcp.mongodb.net/hml?retryWrites=true',
                jwt_pass: 'zJ$&FvsWlE',
                jwt_expires_in: '5h'               
            }

        case 'prod':
            return{
                bd_string: 'mongodb+srv://user_adm:TjZQmAcPQm5HxNlY@sismip-db-iyerz.gcp.mongodb.net/prod?retryWrites=true',
                jwt_pass: 'zJ$&FvsWlE',
                jwt_expires_in: '24h'
            }
        break;
    }

}

console.log ('Iniciando a API em Ambiente: ', env.toUpperCase());

module.exports = config();