export const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const PHONE_NUMBER_REGEX=/^[0-9]+$/;

export const PASSWARD_REGEX=/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const GENDER_REGEX=[0,1,2,9];

export const ATTRIBUTE_TYPE=["INBOX","DRAFT","TRASH","SENT"];

export const verifyEmailFormat=(args: string|Array<string>):boolean => {
    
    if(Array.isArray(args)){
        let flag=true
        for(let i=0;i<args.length;i++){
            if(!EMAIL_REGEX.test(args[i])){
                flag=false
                break
            }
        }
        return flag
    }

    return EMAIL_REGEX.test(args)
}

export const verifyPasswardFormat=(args: string):boolean => {
    return PASSWARD_REGEX.test(args)
}

export const verifyPhoneNumberFormat=(args: string):boolean => {
    return PHONE_NUMBER_REGEX.test(args)
}

export const verifyGenderFormat=(args: number):boolean => {
    if(args in GENDER_REGEX){
        return true
    }

    return false
}