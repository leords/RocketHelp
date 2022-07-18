import { Button as ButtonNativeBase, IButtonProps, Heading } from 'native-base';

type Props = IButtonProps & {  //o props é igual o Ibuttonprops e a essa tipagem customizada!
    title: string;
}

export function Button( {title, ...rest } : Props) {
  return (
    <ButtonNativeBase
        bg="green.700"
        h={14}
        fontSize="sm"
        rounded="sm"
        _pressed={{
            bg: "green.500"
        }}

        { ...rest }
    >
        <Heading color="white" fontSize="sm"> 
            {title} 
        </Heading>
    </ButtonNativeBase>
  );
}