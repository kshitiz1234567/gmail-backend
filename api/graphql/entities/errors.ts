import { objectType, list } from "nexus"

export const errorType=objectType({
    name:"errorType",
    definition(t){
        t.string("code"),
        t.string("message")
    }
})

export const error=objectType({
    name:"error",
    definition(t){
        t.string("code"),
        t.field("errors",{type:list("errorType")})
    }
})