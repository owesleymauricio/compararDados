'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Input, Stack, Spinner, Text } from "@chakra-ui/react";
import jsPDF from 'jspdf'; // Importa a biblioteca jsPDF para geração de PDF
import { read, utils, writeFile } from 'xlsx';
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


  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Download em PDF
  const handleDownloadPDF = () => {
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

  /*Download em XLSX

    const exportFile = useCallback(() => {
 generate worksheet from state 
      const ws = utils.json_to_sheet(pres);
  create workbook and append worksheet 
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Data");
       export to XLSX 
      writeFile(wb, "serial_numbers.xlsx");
    }, [pres]);


  */
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //lê o arquivo
  const reader = selectedFile.text();
  reader.onload = () => {
    const fileContent = reader;
    const notFoundSerials = [];

    //separa o arquivo em linhas
    const serialsInFile = fileContent.split('\n');

    //para cada  linha ele vai fazer a busca binária
    for (let i = 0; i < serialsInFile.length; i++) {
      //pega os comandos (daria de fazer um triger no próprio banco pra não deixar a lógica tão exposta aqui no código)

      let queryA = "db2 select * from radio_safecode where radio_vin in (" + serialsInFile[i] + ")";
      let queryT = "db2 select * from radio_safecode where radio_vin in (" + serialsInFile[i] + ")";
      let queryC = "db2 select * from radio_safecode where radio_vin in (" + serialsInFile[i] + ")";

      //faz a consulta no banco de dados
      let resultA = apiAnchieta.query(queryA);
      let resultB = apiTaubate.query(queryT);
      let resultC = apiCuritiba.query(queryC);

      //se nos três bancos de dados der 'null', adiciona no pdf ou xml
      if (resultA === null) {
        if (resultB === null) {
          if (resultC === null) {
            notFoundSerials[i] = serialsInFile[i];
          }
        }
      }

      if (notFoundSerials.length === 0) {
        setSearchResult('Todos os números de série do arquivo estão presentes no banco de dados.');
      } else {
        setSearchResult('');
        setNotFoundSerials(notFoundSerials); // Atualiza o estado com os números de série não encontrados
      }

      setLoading(false); // Desativa o spinner de carregamento
    }
  }






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
          <Button colorScheme='teal' variant='outline' onClick={handleDownloadPDF}>
            Download PDF
          </Button>
          <Button colorScheme='teal' variant='outline' onClick={handleDownloadXLSX}>
            Download XLSX
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
