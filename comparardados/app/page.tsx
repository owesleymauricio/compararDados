'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Flex, Input, Stack, Spinner, Text, SimpleGrid } from "@chakra-ui/react";
import { DadosTeste } from './data/dados'; // Importa os dados do banco de dados
import jsPDF from 'jspdf';// Importa a biblioteca jsPDF para geração de PDF
import * as XLSX from 'xlsx';

export default function Home() {
  // Estado para armazenar o arquivo selecionado
  const [selectedFile, setSelectedFile] = useState(null);
  // Estado para armazenar o resultado da pesquisa
  const [searchResult, setSearchResult] = useState('');
  // Estado para armazenar os números de série não encontrados
  const [notFoundSerials, setNotFoundSerials] = useState([]);
  // Estado para controlar o spinner de carregamento
  const [loading, setLoading] = useState(false);
  // Estado para controlar a visibilidade do botão "Voltar ao topo"
  const [showBackToTop, setShowBackToTop] = useState(false);

  /* Este efeito é usado para adicionar um event listener ao scroll da janela 
** quando o componente é montado.
** Ele chama a função handleScroll sempre que o evento de scroll ocorre.
** O array vazio [] no final significa que este
** efeito será executado apenas uma vez, após o componente ser montado.*/

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    // Retorna uma função de limpeza para remover o event listener quando o componente for desmontado.

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Esta função é chamada quando o usuário clica no botão "Voltar para o topo".
** Ela utiliza o método scrollTo para rolar a janela para o topo da página,
** com um efeito de rolagem suave definido pela opção behavior: "smooth".*/

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  /* Esta função é chamada quando ocorre um evento de scroll.
  ** Ela verifica a posição do scroll da janela (window.scrollY) e, se for maior que 300 pixels,
  ** define o estado setShowBackToTop como true para mostrar o botão de voltar para o topo.
  ** Caso contrário, define o estado como false para esconder o botão.*/

  // Função para lidar com a mudança no arquivo selecionado

  const handleFileChange = (event: any) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };
  // Função para processar o upload do arquivo

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Nenhum arquivo selecionado.");
      return;
    }

    setLoading(true);// Ativa o spinner de carregamento
    const reader = new FileReader();
    reader.onload = () => {
      const fileContent: any = reader.result;
      const notFoundSerialsTemp: any = [];

      /*estamos dividindo o conteúdo do arquivo .txt em linhas usando split('\n'),
     ** depois percorrendo cada número de série no arquivo. Para cada número de 
     ** série no arquivo, verificamos se ele está presente no banco de dados usando 
     ** DadosTeste.some(). Se não estiver presente no banco de dados, adicionamos à 
     ** lista notFoundSerials.*/
      const serialsInFile = fileContent.split('\n');
      serialsInFile.forEach((serial: string) => {
        // Verifica se o número de série não está presente no banco de dados

        if (!DadosTeste.some(item => item.serial === serial.trim())) {
          notFoundSerialsTemp.push(serial.trim());
        }
      });

      // Verifica se há números de série não encontrados

      if (notFoundSerialsTemp.length === 0) {
        setSearchResult('Todos os números de série do arquivo estão presentes no banco de dados.');
      } else {
        setSearchResult('');
        setNotFoundSerials(notFoundSerialsTemp);// Atualiza o estado com os números de série não encontrados
      }

      setLoading(false);// Desativa o spinner de carregamento

    };

    reader.readAsText(selectedFile);
  };
  // Função para lidar com o download do PDF

  const handleDownloadPDF = () => {
    if (!selectedFile) {
      alert("Nenhum arquivo para download.");
      return;
    }

    const doc = new jsPDF();// Cria um novo documento PDF
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

  const handleDownloadExcel = () => {
    if (!selectedFile) {
      alert("Nenhum arquivo para download.");
      return;
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([["Números de série não encontrados"]]);

    notFoundSerials.forEach((serial, index) => {
      XLSX.utils.sheet_add_aoa(ws, [[serial]], { origin: -1 });
    });

    XLSX.utils.book_append_sheet(wb, ws, "Números de Série");

    XLSX.writeFile(wb, 'serial_numbers.xlsx');
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
          Radio Safecode checker
        </Text>

        <Box p={4} maxW={'600px'}>
          <Text fontSize="xl" mb={4}>
            Selecione um arquivo .txt:
          </Text>
          <Input type="file" onChange={handleFileChange} accept=".txt" mt={2} p={1} mb={2} />
        </Box>
<Flex flexWrap={{ base: 'wrap', md: 'nowrap' }}>
        <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} mb={30} align='center'>
          <Button width={'180px'} colorScheme='teal' variant='solid' onClick={handleUpload}>
            Gerar
          </Button>
          <Button width={'180px'}  colorScheme='teal' variant='outline' onClick={handleDownloadPDF}>
            Download PDF
          </Button>
          <Button width={'180px'} colorScheme='teal' variant='outline' onClick={handleDownloadExcel}>
            Download Planilha
          </Button>

          {notFoundSerials.length > 0 && (
            <Button colorScheme='red' variant='outline' onClick={clearNotFoundSerials}>
              Limpar lista
            </Button>
          )}
        </Stack>
        </Flex>
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
