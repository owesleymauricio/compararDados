import mysql from 'mysql2/promise';

// Função para conectar ao banco de dados
async function connectToDatabase(host, user, password, database) {
  const connection = await mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database,
  });

  try {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    return connection;
  } catch (error) {
    console.error('Erro ao conectar-se ao banco de dados:', error);
    throw error; // Propaga o erro para ser tratado externamente, se necessário
  }
}

// Conectar aos bancos de dados Anchieta, Curitiba e Taubaté
const anchientaConnection = await connectToDatabase('localhost', 'root', 'senha', 'Anchieta_radio');

export default anchientaConnection;
