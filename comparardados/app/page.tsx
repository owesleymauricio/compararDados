'use client'

import DateFilter from "@/components/filtroData";
import FiltroRadio from "@/components/filtroarq";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text
} from "@chakra-ui/react";


import React, { useState } from 'react';

export default function Home() {

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event: any) => {
    // Obtém o primeiro arquivo da lista de arquivos selecionados
    const file = event.target.files[0];
    // Atualiza o estado com o arquivo selecionado
    setSelectedFile(file);
  };


  const handleUpload = () => {
    if (selectedFile) {
      // aqui manipulo a informação
      console.log("Arquivo selecionado:", selectedFile);
    } else {
      alert("Nenhum arquivo selecionado.");
    }
  };

  const handleDownload = () => {
    if (selectedFile) {
      // Cria um objeto URL para o arquivo
      const fileURL = URL.createObjectURL(selectedFile);

      // Cria um link temporário para realizar o download
      const downloadLink = document.createElement("a");
      downloadLink.href = fileURL;
      downloadLink.download = selectedFile;

      // Adiciona o link ao documento e clica nele para iniciar o download
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Remove o link do documento
      document.body.removeChild(downloadLink);
    } else {
      alert("Nenhum arquivo para download.");
    }
  };


  return (
    <>
      <Flex
        // height="100vh" // Define a altura da tela inteira
        // width={"100vw"}
        // alignItems="center" // Centraliza verticalmente
        //justifyContent="center" // Centraliza horizontalmente
        flexDirection={'column'}
        justify={'center'}
        px={4}

      >
        {/* inicio input que seleciona o arquivo*/}
        <Text
          fontSize='50px'
          color='#F0FFFF'
          borderBottom={'2px '}
        >
          RadioSafecode checker
        </Text>

        <Box p={4} maxW={'300px'}>
          <Text fontSize="xl" mb={4}>
            Selecione um arquivo .txt:
          </Text>
          <Input type="file" onChange={handleFileChange} accept=".txt" mb={4} />

        </Box>

        {/* fim input que seleciona o arquivo*/}


        <FiltroRadio />

        <DateFilter />

       

        <Stack direction='row' spacing={4} align='center'>
          <Button colorScheme='teal' variant='solid' onClick={handleUpload}>
            Gerar
          </Button>
          <Button colorScheme='teal' variant='outline' onClick={handleDownload}>
            Download
          </Button>
        </Stack>


      </Flex>

    </>
  )
}