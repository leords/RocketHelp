import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

// parametro da tipagem: FirebaseFirestoreTypes.Timestamp.
export function dateFormat(timestamp: FirebaseFirestoreTypes.Timestamp) {
    
    if(timestamp) {
        const date = new Date(timestamp.toDate());

        const day = date.toLocaleDateString('pt-BR');
        const hour = date.toLocaleTimeString('pt-BR');

        return `${day} às ${hour}`;
    }
}