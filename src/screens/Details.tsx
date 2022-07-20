import { useNavigation, useRoute } from '@react-navigation/native';
import { HStack, useTheme, VStack, Text, ScrollView, Box } from 'native-base';
import { useEffect, useState } from 'react';
import firestore from "@react-native-firebase/firestore"
import { dateFormat } from '../utils/firestorageDateFormat';

import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';
import { CardDetails } from '../components/CardDetails';

import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { CircleWavyCheck, DesktopTower, Hourglass, Clipboard } from 'phosphor-react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';


type RouteParams = {
  orderId: string
}

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false)
  const [solution, setSolution] = useState('')
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

  const navigation = useNavigation()
  const { colors } = useTheme();
  const route = useRoute();
  const { orderId } = route.params as RouteParams;

  function handleOrderClosed() {
    setIsLoadingButton(true)
    if(!solution) {
      return Alert.alert('Solicitação', 'Informe a solução para encerrar a solicitação')
      setIsLoadingButton(false)
    }

    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .update({
      status: 'closed',
      solution,
      closed_at: firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      Alert.alert('Solicitação', 'Solicitação encerrada')
      setIsLoadingButton(false)
      navigation.goBack()
    })
    .catch((error) => {
      console.log(error)
      setIsLoadingButton(false)
      Alert.alert('Solicitação', 'Não foi possivel fazer a solicitação')
    })
  }

  useEffect(() => {
    firestore()
    .collection<OrderFirestoreDTO>('orders')  //tipando o retorno
    .doc(orderId) //buscando por um doc especifico
    .get() //pegue!
    .then((doc) => {
      const {patrimony, description, status, create_at, closed_at, solution} = doc.data();

      const closed = closed_at ? dateFormat(closed_at) : null;

      setOrder({
        id: doc.id,
        patrimony,
        description,
        status,
        solution,
        when: dateFormat(create_at),
        closed
      });

      setIsLoading(false)
    });

  }, []);

  if(isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg="gray.700" >
      <Box px={6} bg="gray.600">
        <Header title="Solicitação"/>
      </Box>
        <HStack bg="gray.500" justifyContent="center" p={4}>
          {
            order.status === 'closed'
            ? <CircleWavyCheck size={22} color={colors.green[300]} />
            : <Hourglass size={22} color={colors.secondary[700]} />
          }

          <Text
            fontSize="sm"
            color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
            ml={2}
            textTransform="uppercase"
          >
            {order.status === 'closed' ? 'finalilzado' : 'em andamento'}
          </Text>
        </HStack>

        <ScrollView mx={5} showsVerticalScrollIndicator={false} >
          <CardDetails 
            title='equipamento'
            description={`patrimônio ${order.patrimony}`}
            icon={DesktopTower}
          />
          <CardDetails 
            title='descrição do problema'
            description={order.description}
            icon={Clipboard}
            footer={order.when}
          />
          <CardDetails 
            title='solução'
            icon={CircleWavyCheck}
            description={order.solution}
            footer={order.closed && `Encerrado em ${order.closed}`}
          >
            {
              order.status === 'open' &&
              <Input 
              placeholder='Descrição da solução'
              onChangeText={setSolution}
              h={24}
              textAlignVertical="top"
              multiline
            />
            }
          </CardDetails>

        </ScrollView>

        {
          order.status === 'open' && 
            <Button 
              title='Encerrar solicitação'
              m={5}
              onPress={handleOrderClosed}
              isLoading={isLoadingButton}
            />
        }
        
    </VStack>
  );
}