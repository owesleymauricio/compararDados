
import {
  Box,
  Flex,
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";

import Nav from "@/components/layout";
import InputDados from "@/components/InputDados";

export default function Home() {
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
       <Nav />
       <InputDados />
       
     

      </Flex>

    </>
  )
}