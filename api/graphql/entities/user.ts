import { objectType, unionType } from "nexus"

export const User=objectType({
    name:"User",
    definition(t){
        t.string("username"),
        t.string("first_name"),
        t.string("last_name"),
        t.string("phone_number"),
        t.string("recovery_email"),
        t.date("birth_date"),
        t.int("sex")
    },
})

export const authPayLoad=objectType({
    name:"authPayLoad",
    definition(t){
        t.string("token"),
        t.field("user",{
            type:"User",
        })
    },
})

export const UserResult=unionType({
    name:"UserResult",
    definition(t){
        t.members("authPayLoad","error","errorType")
    }
})

export const queryResult=unionType({
    name:"queryResult",
    definition(t){
        t.members("status","errorType")
    }
})