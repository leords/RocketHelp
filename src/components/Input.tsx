import { Input as NativeBaseInput, IInputProps } from 'native-base'; //renomeando o Input para não dar conflito com o nome da função - as "new name"

export function Input( { ...rest } : IInputProps ) { //tipando com as propriedades do iinputProps
  return (
    <NativeBaseInput 
        bg="gray.700"
        h={14}
        size="md"
        borderWidth={0}
        fontSize="md"
        fontFamily="body"
        color="white"
        placeholderTextColor="gray.300"
        _focus={{
            borderWidth: 1,
            borderColor: "green.500",
            bg: "gray.700"
        }}


        { ...rest }
    />
  );
}