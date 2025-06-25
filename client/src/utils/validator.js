import { isValidUsername } from "6pp"

export const usernameValidator = (username) => {
    console.log('first',username,isValidUsername(username))
    if (!isValidUsername(username))
        return { isValid: false, errorMessage: " Username is Invalid" }
    
}