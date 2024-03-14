
"use server"
import connectToDatabase from '../connection'
import { quicksort } from '../sortingAlgorithms';
import { binarySearch } from '../sortingAlgorithms';
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  // Lógica de manipulação do arquivo
  try {
    const connection = await connectToDatabase('localhost', 'root', 'Fatima&Sueli2022**', 'Anchieta_radio');
    const { fileContent } = req.body;

    // Execute as consultas no banco de dados
    const [resultA] = await connection.query('SELECT * FROM radio_safecode');
    const [resultT] = await connection.query('SELECT * FROM radio_safecode');
    const [resultC] = await connection.query('SELECT * FROM radio_safecode');

    // Ordenar os resultados das consultas
    const sortedResultA = quicksort(resultA, 0, resultA[0].length);
    const sortedResultB = quicksort(resultT, 0, resultT[0].length);
    const sortedResultC = quicksort(resultC, 0, resultC[0].length);

    const serialsInFile = fileContent.split('\n');
    const notFoundSerials = [];

    serialsInFile.forEach(serial => {
      if (binarySearch(sortedResultA, serial.trim(), 0, serial.trim().length) === -1 &&
          binarySearch(sortedResultB, serial.trim(), 0, serial.trim().length) === -1 &&
          binarySearch(sortedResultC, serial.trim(), 0, serial.trim().length) === -1) {
        notFoundSerials.push(serial.trim());
      }
    });

    if (notFoundSerials.length === 0) {
      res.status(200).json({ message: 'Todos os números de série do arquivo estão presentes no banco de dados.' });
    } else {
      res.status(200).json({ notFoundSerials });
    }

    await connection.end();
  } catch (error) {
    console.error('Erro ao executar consulta:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
