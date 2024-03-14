home:
"use client"
import { useState } from 'react';
import { Flex, Stack, Text, Box, Input, Button, Spinner } from '@chakra-ui/react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import HandleFiles from './handleFiles'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchResult, setSearchResult] = useState('');
  const [notFoundSerials, setNotFoundSerials] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Nenhum arquivo selecionado.");
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const fileContent = reader.result;

      try {
        const response = await fetch(HandleFiles, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileContent }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.message) {
            setSearchResult(data.message);
            setNotFoundSerials([]);
          } else {
            setSearchResult('');
            setNotFoundSerials(data.notFoundSerials);
          }
        } else {
          console.error('Erro ao enviar o arquivo:', response.statusText);
          alert('Erro ao enviar o arquivo. Por favor, tente novamente.');
        }

        setLoading(false);
      } catch (error) {
        console.error('Erro ao enviar o arquivo:', error);
        alert('Erro ao enviar o arquivo. Por favor, tente novamente.');
        setLoading(false);
      }
    };

    reader.readAsText(selectedFile);
  };

  const clearNotFoundSerials = () => {
    setNotFoundSerials([]);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    notFoundSerials.forEach((serial, index) => {
      doc.text(serial, 10, 10 + index * 10);
    });
    doc.save('not_found_serials.pdf');
  };

  const handleDownloadExcel = () => {
    const wsData = [['Números de série não encontrados']];
    notFoundSerials.forEach(serial => {
      wsData.push([serial]);
    });
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Números de Série');
    XLSX.writeFile(wb, 'not_found_serials.xlsx');
  };

  return (
    <Flex
    bg="black"
    color="white"
    flexDirection="column"
    justify="center"
    px={4}
  >
    <Text fontSize='50px' color='#F0FFFF' borderBottom={'2px '}>
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
      <Button colorScheme='teal' variant='outline' onClick={handleDownloadExcel}>
        Download Planilha
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
  );
}
