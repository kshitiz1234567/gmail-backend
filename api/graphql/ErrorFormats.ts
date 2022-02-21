
export const badUserInput="BAD_USER_INPUT"

export const wrongEmailFormat={
    code:"WRONG_EMAIL_FORMAT",
    message:"email format is wrong"
}

export const wrongPhoneNumberFormat={
    code:"WRONG_PHONE_NUMBER_FORMAT",
    message:"phone number format is wrong"
}

export const wrongPasswardFormat={
    code:"WRONG_PASSWARD_FORMAT",
    message:"passward format is wrong"
}

export const wrongGenderFormat={
    code:"WRONG_GENDER_FORMAT",
    message:"format of gender input is wrong"
}

export const unknownError={
    code:"UNKNOWN_ERROR",
    message:"unknown error has occured"
}

export const userNotFound={
    code:"USER_NOT_FOUND",
    message:"user does not exist"
}

export const passwardWrong={
    code:"WRONG_PASSWARD",
    message:"passward is wrong"
}

export const usernameNotAvailable={
    code:"USERNAME_NOT_AVAILABLE",
    message:"username already in use"
}

export const usernameNotProvided={
    code:"USERNAME_NOT_PROVIDED",
    message:"cannot use services without logging in"
}

export const messageNotFound={
    code:"MESSAGE_NOT_FOUND",
    message:"no such message exist"
}

export const messageNotUpdated={
    code:"NOT_UPDATED",
    message:"only draft messages can be updated"
}

export const unauthorizedAccess={
    code:"UNAUTHORIZED_ACCESS",
    message:"this is an unauthorized request"
}

export const noRecipient={
    code:"NO_RECIPIENT",
    message:"specify at least one recipient"
}

export const wrongRequest={
    code:"WRONG_REQUEST",
    message:"only draft messages can be used"
}

export class errorObject {
    code:string
    message:string

    constructor(code:string,message:string){
        this.code=code
        this.message=message
    }
}

export class errorListObject {
    code:string
    errors:Array<object>

    constructor(code:string,errors:Array<object>){
        this.code=code
        this.errors=errors
    }
}

