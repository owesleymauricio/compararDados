
const Sequelize = require('sequelize');

const sqlz = new Sequelize('bancos_radios', 'postgres', '123456', {
  host: 'localhost',
  dialect: 'postgres'
});


// ao possuir informações acerca dos bancos de dados, descomentar essas linhas e colocar aqui
// lembrar que, será necessário fazer uma pesquisa em todos em todas as lógicas. 
/*
const db2 = new Sequelize('bancos_radios', 'postgres', '123456', {
  host: 'localhost',
  dialect: 'postgres'
});


const db3 = new Sequelize('bancos_radios', 'postgres', '123456', {
  host: 'localhost',
  dialect: 'postgres'
}); */
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch((err: any) => {
    console.error('Erro ao conectar-se ao banco de dados:', err);
  });
module.exports = sqlz; 