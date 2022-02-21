
export const notAvailable="NOT_AVAILABLE"

export const available="AVAILABLE"

export const success="SUCCESSFUL"

export const failure="FAILED"

export class statusObject {
    status_code:string
    message:string
    list:Array<string>

    constructor(status_code:string,message:string){
        this.status_code=status_code
        this.message=message
        this.list=[]
    }

    setStatusList(list:Array<string>){
        this.list.push(...list)
    }

}