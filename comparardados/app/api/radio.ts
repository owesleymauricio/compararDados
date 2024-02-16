// Importe o Sequelize e a conexão com o banco de dados
const { DataTypes } = require('sequelize');
const sequelize = require('./database');


// Defina o modelo Radio
const Radio = sequelize.define('Radio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATE
  },
  code: {
    type: DataTypes.STRING
  },
  serial: {
    type: DataTypes.STRING
  },
  value: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'bancos_radios', // nome da tabela no banco de dados
  timestamps: false // se você não quiser os campos createdAt e updatedAt
});

module.exports = Radio;
