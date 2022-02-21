import { objectType, list, unionType, inputObjectType } from "nexus"

const months:string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"]


export const Message=objectType({
    name:"Message",
    definition(t){
        t.id("mappingId"),
        t.string("subject"),
        t.string("body"),
        t.string("authorName"),
        t.list.string("recipientName"),
        t.list.string("Cc"),
        t.list.string("Bcc"),
        t.dateTime("time")
        t.boolean("isStarred"),
        t.boolean("isRead"),
        t.string("attribute"),
        t.field("dateAndTime",{
            type:"dateTimeDestructure",
            resolve(root,args,ctx){
                const date=new Date(root.time)
                const today=new Date()

                return {
                    isToday:date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear(),
                    day:months[<any>date.toLocaleString('en-IN', { month: 'numeric'})-1] + " " + date.toLocaleString('en-IN', { day: 'numeric'}),
                    year:date.toLocaleString('en-IN', { year: 'numeric'}),
                    time:date.toLocaleString('en-IN', { hour: 'numeric',minute: 'numeric', hour12: true })
                }

            }
        })
    },
})

export const dateTimeDestructure=objectType({
    name:"dateTimeDestructure",
    definition(t){
        t.boolean("isToday")
        t.string("day"),
        t.string("year"),
        t.string("time")
    }
})

export const listOfMessage=objectType({
    name:"listOfMessage",
    definition(t){
        t.field("listOfMessage",{type:list("Message")})
    }
})


export const statusResult=unionType({
    name:"statusResult",
    definition(t){
        t.members("status","errorType")
    }
})

export const messageInput=inputObjectType({
    name:"messageInput",
    definition(t){
        t.nonNull.list.nonNull.string("recipientName"),
        t.nonNull.list.nonNull.string("Cc"),
        t.nonNull.list.nonNull.string("Bcc"),
        t.string("subject"),
        t.string("body")
    }
})

export const dateTimeInput=inputObjectType({
    name:"dateTimeInput",
    definition(t){
        t.nonNull.dateTime("gte"),
        t.nonNull.dateTime("lte")
    }
})

export const messageResult=unionType({
    name:"messageResult",
    definition(t){
        t.members("Message","errorType")
    }
})

export const listOfMessageResult=unionType({
    name:"listOfMessageResult",
    definition(t){
        t.members("listOfMessage","errorType")
    }
})

