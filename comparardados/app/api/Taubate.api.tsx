
const Sequelize = require('sequelize');

const dbt = new Sequelize('bancos_radios', 'postgres', '123456', {
  host: 'localhost',
  dialect: 'postgres'
});


dbt
  .authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch((err: any) => {
    console.error('Erro ao conectar-se ao banco de dados:', err);
  });
module.exports = dbt; 
