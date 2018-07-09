import { AuthService } from "../services/auth.service";


export class TokenHelper {
    constructor(authService: AuthService){

    }
    /**
     * getToken
     * * Obtiene el token del local storage del navegador
     */
    public static getToken(){
        var token = localStorage.getItem('authServerToken')
        if(token != null){
            var tokenStored = JSON.parse(token)
            return tokenStored
        }
        return null
    }
    /**
     * setToken
     * * Guarda la información del token en el localstorage
     * @param token token generado
     */
    public static setToken(token){
        localStorage.setItem(
            "authServerToken",
            JSON.stringify(token)
          );
    }
}