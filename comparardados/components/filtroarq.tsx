import React from 'react'

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
    Text
  } from "@chakra-ui/react";

function FiltroRadio() {
  return (
    <Flex border={'0.5px solid #808080'}
        borderRadius={'4px'}
        padding={'10px'}
        maxW={'500px'}
    >
       
       <FormControl as='fieldset'>
          <FormLabel as='legend'>
          Filter to organize the file
          </FormLabel>
          <RadioGroup defaultValue='Itachi'>
            <HStack spacing='24px'>
              <Radio value='Sasuke'>Data Base</Radio>
              <Radio value='Nagato'>Fis</Radio>
              <Radio value='Itachi'>With date</Radio>
            </HStack>
          </RadioGroup>
          <FormHelperText>Select how you want to organize.</FormHelperText>
        </FormControl>
    </Flex>
  )
}

export default FiltroRadio;