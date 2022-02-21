import { objectType } from "nexus"

export const status=objectType({
    name:"status",
    definition(t){
        t.string("status_code"),
        t.string("message"),
        t.list.string("list")
    }
})