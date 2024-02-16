'use client'

import DateFilter from "@/components/filtroData";
import FiltroRadio from "@/components/filtroarq";
import {
  Box,
  Button,
  Flex,
  Input,
  Stack,
  Spinner,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import {DadosTeste} from './data/dados'; // Importa os dados do banco de dados
import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf'; // Importa a biblioteca jsPDF para geração de PDF

export default function Home() {
   // Estado para armazenar o arquivo selecionado
  const [selectedFile, setSelectedFile] = useState<File | null | any>(null); 
  // Estado para armazenar o resultado da pesquisa
  const [searchResult, setSearchResult] = useState(''); 
  // Estado para armazenar os números de série não encontrados
  const [notFoundSerials, setNotFoundSerials] = useState<string[]>([]); 
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
  window.addEventListener('scroll', handleScroll);
  // Retorna uma função de limpeza para remover o event listener quando o componente for desmontado.
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

/* Esta função é chamada quando ocorre um evento de scroll.
** Ela verifica a posição do scroll da janela (window.scrollY) e, se for maior que 300 pixels,
** define o estado setShowBackToTop como true para mostrar o botão de voltar para o topo.
** Caso contrário, define o estado como false para esconder o botão.*/
const handleScroll = () => {
  if (window.scrollY > 300) {
    setShowBackToTop(true);
  } else {
    setShowBackToTop(false);
  }
};

/* Esta função é chamada quando o usuário clica no botão "Voltar para o topo".
** Ela utiliza o método scrollTo para rolar a janela para o topo da página,
** com um efeito de rolagem suave definido pela opção behavior: "smooth".*/
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};


  // Função para lidar com a mudança no arquivo selecionado
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  // Função para processar o upload do arquivo
  const handleUpload = () => {
    if (selectedFile) {
      setLoading(true); // Ativa o spinner de carregamento


      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;

        const notFoundSerialsTemp: string[] = [];

       /*estamos dividindo o conteúdo do arquivo .txt em linhas usando split('\n'),
       ** depois percorrendo cada número de série no arquivo. Para cada número de 
       ** série no arquivo, verificamos se ele está presente no banco de dados usando 
       ** DadosTeste.some(). Se não estiver presente no banco de dados, adicionamos à 
       ** lista notFoundSerials.*/ 
        const serialsInFile = fileContent.split('\n');
        serialsInFile.forEach(serial => {
          // Verifica se o número de série não está presente no banco de dados
          const isSerialPresentInDB = DadosTeste.some(item => item.serial === serial.trim());
          if (!isSerialPresentInDB) {
            notFoundSerialsTemp.push(serial.trim());
          }
        });

        // Verifica se há números de série não encontrados
        if (notFoundSerialsTemp.length === 0) {
          setSearchResult(
            'Todos os números de série do arquivo estão presentes no banco de dados.'
            );
            console.log(`
            Número de série ${notFoundSerialsTemp}
             encontrado no arquivo.${selectedFile}
             `);
        } else {
          setSearchResult('');
          setNotFoundSerials(notFoundSerialsTemp); // Atualiza o estado com os números de série não encontrados
        }

        setLoading(false); // Desativa o spinner de carregamento
      };

      reader.readAsText(selectedFile);
    } else {
      alert("Nenhum arquivo selecionado.");
    }
  };

  // Função para lidar com o download do PDF
  const handleDownload = () => {
    if (selectedFile) {
      const doc = new jsPDF(); // Cria um novo documento PDF
      doc.text(searchResult, 10, 10); // Adiciona o resultado da pesquisa ao PDF
      doc.text('Números de série não encontrados:', 10, 20); // Adiciona um título para os números de série não encontrados

      // Itera sobre os números de série não encontrados e os adiciona ao PDF
      notFoundSerials.forEach((serial, index) => {
        doc.text(`${index + 1}. ${serial}`, 10, 30 + (index * 10));
      });

      doc.save('serial_numbers.pdf'); // Salva o PDF com o nome especificado
    } else {
      alert("Nenhum arquivo para download.");
    }
  };

  // Função para limpar a lista de números de série não encontrados
  const clearNotFoundSerials = () => {
    setNotFoundSerials([]);
  };

  return (
    <>
      <Flex
        flexDirection={'column'}
        justify={'center'}
        px={4}
      >
        <Text fontSize='50px' color='#F0FFFF' borderBottom={'2px '}>
          RadioSafecode checker
        </Text>

        <Box p={4} maxW={'300px'}>
          <Text fontSize="xl" mb={4}>
            Selecione um arquivo .txt:
          </Text>
          <Input type="file" onChange={handleFileChange} accept=".txt" mb={4} />
        </Box>

        <Stack direction='row' spacing={4} align='center'>
          <Button colorScheme='teal' variant='solid' onClick={handleUpload}>
            Gerar
          </Button>
          <Button colorScheme='teal' variant='outline' onClick={handleDownload}>
            Download PDF
          </Button>
          {notFoundSerials.length > 0 && ( // Renderiza o botão apenas se houver números de série não encontrados
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
              <Box mt={4} style={{overflowX: 'auto'}}>
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
         {searchResult &&<Text>{searchResult}</Text>}
      </Flex>
    </>
  )
}
