import {auth} from "../firebase/config"
import {signOut} from "firebase/auth"


export const useLogout = () => {

    const logout = () => {
        signOut(auth).then(() => {

        }).catch((err) => {

        })
    }

    return {logout}
}