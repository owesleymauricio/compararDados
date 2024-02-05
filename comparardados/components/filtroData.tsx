import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  ChakraProvider,
  Flex,
} from "@chakra-ui/react";

function DateFilter() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilter = () => {
    
    console.log("Filtrar por período:", startDate, "até", endDate);
  };

  return (
    <ChakraProvider>
        <Flex border={'0.5px solid #808080'}
        borderRadius={'4px'}
        padding={'10px'}
        maxW={'500px'}
        marginTop={'20px'}
        flexDirection={'column'}
        >
      <FormControl>
        <FormLabel>Filtrar por datas</FormLabel>
        <Box display="flex" alignItems="center">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Data de início"
            mr={2}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Data de término"
            mr={2}
          />
          <Button onClick={handleFilter} colorScheme="teal">
            Filtrar
          </Button>
        </Box>
      </FormControl>
      </Flex>
    </ChakraProvider>
  );
}

export default DateFilter;
