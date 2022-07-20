import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"

import { SignIn } from "../screens/SingIn";
import { AppRoutes } from "./app.routes";
import { Loading } from "../components/Loading";

export function Routes() {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User>();  //typagem do firebase tipe User.

    useEffect(() => {
        const subscriber = auth()
        .onAuthStateChanged(response => {
            setUser(response);
            setLoading(false)
        });

        return subscriber; //método de limpeza?
    },[])

    if (loading) {
        return <Loading />
    }

    return (
        <NavigationContainer>
            { user ? <AppRoutes /> : <SignIn />}
        </NavigationContainer>
    )
}