'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Input, Stack, Spinner, Text } from "@chakra-ui/react";
import jsPDF from 'jspdf'; // Importa a biblioteca jsPDF para geração de PDF
import { DadosTeste } from './data/dados'; // Importa os dados do banco de dados
import apiCuritiba from './api/Curitiba.api'
import apiAnchieta from './api/Anchieta.api'
import apiTaubate from './api/Taubate.api'

export default function Home() {
  // Estados para armazenar o arquivo selecionado, o resultado da pesquisa,
  // os números de série não encontrados, o estado de carregamento e a visibilidade do botão "Voltar ao topo"
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchResult, setSearchResult] = useState('');
  const [notFoundSerials, setNotFoundSerials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Função para ordenar a matriz usando o algoritmo quicksort
  function quicksort(array) {
    if (array.length <= 1) return array;
    const pivot = array[0].substring(Ninicial, Nfinal);
    const head = array.filter(n => n.substring(Ninicial, Nfinal) < pivot);
    const equal = array.filter(n => n.substring(Ninicial, Nfinal) === pivot);
    const tail = array.filter(n => n.substring(Ninicial, Nfinal) > pivot);
    return quicksort(head).concat(equal).concat(quicksort(tail));
  }

  // Função para realizar a busca binária em uma matriz ordenada
  function binarySearch(sortedArray, target) {
    let left = 0;
    let right = sortedArray.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const element = sortedArray[mid];
      const substring = element.substring(Ninicial, Nfinal);
      if (substring === target) {
        return mid; // Elemento encontrado, retorna o índice
      } else if (substring < target) {
        left = mid + 1; // Busca na metade direita
      } else {
        right = mid - 1; // Busca na metade esquerda
      }
    }
    return -1; // Elemento não encontrado
  }

  // Função para lidar com a mudança no arquivo selecionado
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  // Função para processar o upload do arquivo
  const handleUpload = () => {
    if (!selectedFile) {
      alert("Nenhum arquivo selecionado.");
      return;
    }

    setLoading(true); // Ativa o spinner de carregamento


      const reader = selectedFile.text();
      reader.onload = () => {
        const fileContent = reader;
        const notFoundSerials = [];

      //pega os comandos (daria de fazer um triger no próprio banco pra não deixar a lógica tão exposta aqui no código)

      let queryA = "db2 select * from radio_safecode";
      let queryT = "db2 select * from radio_safecode";
      let queryC = "db2 select * from radio_safecode";

      //faz a consulta no banco de dados
      let resultA = apiAnchieta.query(queryA);
      let resultB = apiTaubate.query(queryT);
      let resultC = apiCuritiba.query(queryC);


      // Estamos dividindo o conteúdo do arquivo .txt em linhas usando split('\n'),
      // depois percorrendo cada número de série no arquivo.
      const serialsInFile = fileContent.split('\n');

      let p = 0;
      let t = 0;
      serialsInFile.forEach(serial => {
        // Verifica se o número de série não está presente no banco de dados

        let resultAnchieta = binarySearch(resultA, serial)
  
        if (resultAnchieta === null) {
          let resultTaubate = binarySearch(resultB, serial);
  
          if (resultTaubate === null) {
            let resultCuritiba = binarySearch(resultC, serial);

            if (resultCuritiba === null) {

              notFoundSerials[t] = serialsInFile[p];
              t += 1;
            }
          }
        }
        p += 1;

        /*        if (!DadosTeste.some(item => item.serial === serial.trim())) {
                  if(!DadosTeste.some(item => item.serial === serial.trim())){
                    if(!DadosTeste.some(item => item.serial === serial.trim())){
                      notFoundSerialsTemp.push(serial.trim());
        
                    }
                  }
                }
        */
      });

      // Verifica se há números de série não encontrados
      if (notFoundSerialsTemp.length === 0) {
        setSearchResult('Todos os números de série do arquivo estão presentes no banco de dados.');
      } else {
        setSearchResult('');
        setNotFoundSerials(notFoundSerialsTemp); // Atualiza o estado com os números de série não encontrados
      }

      setLoading(false); // Desativa o spinner de carregamento
    };

    reader.readAsText(selectedFile);
  };

  // Função para lidar com o download do PDF
  const handleDownload = () => {
    if (!selectedFile) {
      alert("Nenhum arquivo para download.");
      return;
    }

    const doc = new jsPDF(); // Cria um novo documento PDF
    let pageNumber = 1;
    let yPosition = 10;

    doc.setFontSize(11);
    doc.text(searchResult, 10, yPosition); // Adiciona o resultado da pesquisa ao PDF
    yPosition += 10;

    doc.text('Números de série não encontrados:', 10, yPosition); // Adiciona um título para os números de série não encontrados
    yPosition += 10;

    // Itera sobre os números de série não encontrados e os adiciona ao PDF

    notFoundSerials.forEach((serial, index) => {
      if (yPosition > 280) {
        doc.addPage();
        pageNumber++;
        yPosition = 10;
        doc.setFontSize(12);
        doc.text(`Página ${pageNumber}`, 10, yPosition);
        yPosition += 10;
      }
      doc.text(`${index + 1}. ${serial}`, 10, yPosition);
      yPosition += 10;
    });

    doc.save('serial_numbers.pdf');// Salva o PDF com o nome especificado
  };

  // Função para limpar a lista de números de série não encontrados

  const clearNotFoundSerials = () => {
    setNotFoundSerials([]);
  };

  return (
    < >
      <Flex
        bg="black"
        color="white"
        flexDirection="column"
        justify="center"
        px={4}
      >        <Text fontSize='50px' color='#F0FFFF' borderBottom={'2px '}>
          RadioSafecode checker
        </Text>

        <Box p={4} maxW={'600px'}>
          <Text fontSize="xl" mb={4}>
            Selecione um arquivo .txt:
          </Text>
          <Input type="file" onChange={handleFileChange} accept=".txt" mt={2} p={1} mb={2} />
        </Box>

        <Stack direction='row' spacing={4} mb={30} align='center'>
          <Button colorScheme='teal' variant='solid' onClick={handleUpload}>
            Gerar
          </Button>
          <Button colorScheme='teal' variant='outline' onClick={handleDownload}>
            Download PDF
          </Button>
          {notFoundSerials.length > 0 && (
            <Button colorScheme='red' variant='outline' onClick={clearNotFoundSerials}>
              Limpar lista
            </Button>
          )}
        </Stack>

        {loading ? (
          <Flex justify="center" mt={4}>
            <Spinner />
          </Flex>
        ) : (
          <>
            {notFoundSerials.length > 0 && (
              <Box mt={4} style={{ overflowX: 'auto' }}>
                <Text fontSize="lg">Números de série não encontrados:</Text>
                <ul>
                  {notFoundSerials.map((serial, index) => (
                    <li key={index}>{serial}</li>
                  ))}
                </ul>
                {showBackToTop && (
                  <Button onClick={scrollToTop} mt={4} size="sm">
                    Voltar ao topo
                  </Button>
                )}
              </Box>
            )}
          </>
        )}
        {searchResult && <Text>{searchResult}</Text>}
      </Flex>
    </>
  )
}
