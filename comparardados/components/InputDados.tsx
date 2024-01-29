'use client'

import { Button, Flex, Input, Text, Textarea } from "@chakra-ui/react"
import { Felipa, Fleur_De_Leah } from "next/font/google";
import React, { useState } from "react";
import { SetStateAction } from "react";


function InputDados() {
    const [value, setValue] = useState('');
    const [textareaValue, setTextareaValue] = useState('');

    const handleSearch = () => {

        if(!value){
            alert('Enter the key you want to search for')
        }else{
        // Adiciona o valor do input à área de texto
      setTextareaValue((prevValue) => prevValue + '\n' + value);
      // Limpa o valor do input
       setValue('');
        }
   };



    const handleClear = () => {
        // Limpa o conteúdo da área de texto
        setTextareaValue('');
    };


    return (
        <>
            <Text
                fontSize={'20px'}
                fontWeight={'bold'}
                marginTop={'20px'}
            >Digite os dados:</Text>

            <Flex
                marginLeft={'auto'}
                marginRight={'auto'}
                gap={'4px'}

            >

                <Input

                    width={'500px'}
                    value={value}
                    onChange={event => setValue(event.target.value)}
                    size='lg'
                />

            </Flex>

            <Flex
                gap={'8px'}
                marginLeft={'auto'}
                marginRight={'auto'}
                marginTop={'30px'}
            >
                <Button colorScheme='blue'
                    size='lg'
                    onClick={handleSearch}
                >Search key</Button>
                <Button
                    colorScheme='red'
                    size='lg'
                    onClick={handleClear}
                >
                    Clear Text Area
                </Button>
            </Flex>

            <Textarea
                marginTop={"40px"}
                width={'500px'}
                height={'300px'}
                marginLeft={'auto'}
                marginRight={'auto'}
                value={textareaValue}
                isDisabled placeholder='Your search will appear here' />
        </>
    )
}

export default InputDados;