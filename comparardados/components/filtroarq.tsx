import React, { useState } from 'react'

import {
  Box,
  Button,
  Checkbox,
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

function FiltroRadio() {
  const [checkboxValues, setCheckboxValues] = useState({
    data_base: true,
    Fis: true,
    with_date: true
  });

  const handleCheckboxChange = (event: any) => {
    const { name, checked } = event.target;
    setCheckboxValues({ ...checkboxValues, [name]: checked });
  };
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
        <Stack>
          <Checkbox colorScheme='green'
            value='data_base'
            checked={checkboxValues.data_base}
            onChange={handleCheckboxChange}
          >
            Data Base
          </Checkbox>
          <Checkbox colorScheme='green'
            value="Fis"
            checked={checkboxValues.data_base}
            onChange={handleCheckboxChange}
            >
            Fis
          </Checkbox>
          <Checkbox colorScheme='green'
            value='with_date'
            checked={checkboxValues.data_base}
            onChange={handleCheckboxChange}
          >
            With Date
          </Checkbox>
        </Stack>

        <FormHelperText>Select how you want to organize.</FormHelperText>
      </FormControl>
    </Flex >
  )
}

export default FiltroRadio;