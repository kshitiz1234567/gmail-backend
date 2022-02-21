import { asNexusMethod, extendType, stringArg, nonNull, booleanArg, intArg} from "nexus";

import { GraphQLDateTime } from "graphql-iso-date";
import { verifyEmailFormat } from "./verificationFormats";
import { messageNotFound, usernameNotProvided, wrongEmailFormat, unauthorizedAccess,noRecipient, wrongRequest, statusObject, failure, success } from ".";
import { dateTimeInput, messageInput } from "./entities/messages";

export const GQLDateTime = asNexusMethod(GraphQLDateTime, 'dateTime');


export const saveMessage=extendType({
    type:"Mutation",
    definition(t){
        t.field("saveMessage",{
            type:"messageResult",
            args:{
                data:nonNull(messageInput)
            },
            async resolve(root,args,ctx){

                const {userId}=ctx

                if(!userId){
                    return {
                        ...usernameNotProvided,
                        __typename:"errorType"
                    }
                }

                
                const data1=await ctx.db.messages.create({data:{
                    ...args.data,
                    authorName:userId}})

                const data2={
                    username:userId,
                    messageId:data1.messageId,
                    attribute:"DRAFT",
                    isRead:false,
                    isStarred:false,
                    time:new Date()
                }

                const data3=await ctx.db.messages_mapping.create({data:data2})

                return {
                    ...data1,
                    mappingId:data3.mappingId,
                    attribute:data3.attribute,
                    isRead:data3.isRead,
                    isStarred:data3.isStarred,
                    time:data3.time,
                    __typename:"Message"
                }

            }
        })
    }
})

export const updateMessage=extendType({
    type:"Mutation",
    definition(t){
        t.field("updateMessage",{
            type:"statusResult",
            args:{
                mappingId:nonNull(stringArg()),
                data:nonNull(messageInput)
            },
            async resolve(root,args,ctx){

                const {userId}=ctx

                if(!userId){
                    return {
                        ...usernameNotProvided,
                        __typename:"errorType"
                    }
                }

                const mapping=await ctx.db.messages_mapping.findUnique({
                    where:{
                        mappingId:args.mappingId
                    }
                })

                if(!mapping){
                    return {
                        ...messageNotFound,
                        __typename:"errorType"
                    }
                }
                else if(mapping.username!==userId){
                    return {
                        ...unauthorizedAccess,
                        __typename:"errorType"
                    }
                }

                if(mapping.attribute!=="DRAFT"){
                    return {
                        ...wrongRequest,
                        __typename:"errorType"
                    }
                }

                const data=await ctx.db.messages.update({
                    where:{
                        messageId:mapping.messageId
                    },
                    data:args.data
                })

                if(data){
                    await ctx.db.messages_mapping.update({
                        where:{
                            mappingId:mapping.mappingId
                        },
                        data:{
                            time:new Date()
                        }
                    })
                    const message="message is updated successfully"
                    const messageUpdateSuccess=new statusObject(success,message)
                    return {
                        ...messageUpdateSuccess,
                        __typename:"status"
                    }
                }
                else{
                    const message="message cannot be updated"
                    const messageUpdateFailure=new statusObject(failure,message)
                    return {
                        ...messageUpdateFailure,
                        __typename:"status"
                    }
                }
            }  
        })
    }
})

export const sentMessage=extendType({
    type:"Mutation",
    definition(t){
        t.field("sentMessageSaved",{
            type:"statusResult",
            args:{
                mappingId:nonNull(stringArg()),
                data:nonNull(messageInput)
            },
            async resolve(root,args,ctx){

                const {userId}=ctx

                if(!userId){
                    return {
                        ...usernameNotProvided,
                        __typename:"errorType"
                    }
                }
                
                if(args.data.recipientName.length===0&&args.data.Cc.length===0&&args.data.Bcc.length===0){
                    return {
                        ...noRecipient,
                        __typename:"errorType"
                    }
                }

                if(!verifyEmailFormat([...args.data.recipientName,...args.data.Cc,...args.data.Bcc])){
                    return {
                        ...wrongEmailFormat,
                        __typename:"errorType"
                    }
                }

                let data=await ctx.db.messages_mapping.findUnique({
                    where: {
                        mappingId:args.mappingId
                    }
                })

                if(data){
                    if(data.username!==userId){
                        return {
                            ...unauthorizedAccess,
                            __typename:"errorType"
                        }
                    }
                    else if(data.attribute==="DRAFT"){
                        await ctx.db.messages.update({
                            where:{
                                messageId:data.messageId
                            },
                            data:args.data
                        })
                        await ctx.db.messages_mapping.update({
                            where:{
                                mappingId:data.mappingId
                            },
                            data:{
                                attribute:"SENT",
                                time:new Date()
                            }
                        })
                    }
                    else{
                        return {
                            ...wrongRequest,
                            __typename:"errorType"
                        }
                    }
                }
                else{
                    return {
                        ...messageNotFound,
                        __typename:"errorType"
                    }
                }

                let array=[...args.data.recipientName,...args.data.Cc,...args.data.Bcc];

                let temp=[]

                for(let i=0;i<array.length;i++){
                    let value=await ctx.db.users.findUnique({
                        where:{
                            username:array[i]
                        }
                    })
                    if(value){
                        await ctx.db.messages_mapping.create({
                            data:{
                                username:array[i],
                                messageId:data.messageId,
                                attribute:"INBOX",
                                isRead:false,
                                isStarred:false,
                                time:new Date()
                            }
                        })
                    }
                    else{
                        temp.push(array[i])
                    }
                }

                if(temp.length===0){
                    const message="message sent successfully"
                    const messageSent=new statusObject(success,message)
                    return {
                        ...messageSent,
                        __typename:"status"
                    }
                }
                else{
                    const message="message cannot be sent to some users"
                    const failedUserNotFound=new statusObject(failure,message)
                    failedUserNotFound.setStatusList(temp)
                    return {
                        ...failedUserNotFound,
                        __typename:"status"
                    }
                }

            }
        })

        t.field("sentMessageNew",{
            type:"statusResult",
            args:{
                data:nonNull(messageInput)
            },
            async resolve(root,args,ctx){
                const {userId}=ctx

                if(!userId){
                    return {
                        ...usernameNotProvided,
                        __typename:"errorType"
                    }
                }

                if(args.data.recipientName.length===0&&args.data.Cc.length===0&&args.data.Bcc.length===0){
                    return {
                        ...noRecipient,
                        __typename:"errorType"
                    }
                }

                if(!verifyEmailFormat([...args.data.recipientName,...args.data.Cc,...args.data.Bcc])){
                    return {
                        ...wrongEmailFormat,
                        __typename:"errorType"
                    }
                }

                const data1=await ctx.db.messages.create({data:{
                    ...args.data,
                    authorName:userId}})

                const data2={
                    username:userId,
                    messageId:data1.messageId,
                    attribute:"SENT",
                    isRead:false,
                    isStarred:false,
                    time:new Date()
                }

                await ctx.db.messages_mapping.create({data:data2})

                let array=[...args.data.recipientName,...args.data.Cc,...args.data.Bcc];

                let temp=[]

                for(let i=0;i<array.length;i++){
                    let value=await ctx.db.users.findUnique({
                        where:{
                            username:array[i]
                        }
                    })
                    if(value){
                        await ctx.db.messages_mapping.create({
                            data:{
                                username:array[i],
                                messageId:data1.messageId,
                                attribute:"INBOX",
                                isRead:false,
                                isStarred:false,
                                time:new Date()
                            }
                        })
                    }
                    else{
                        temp.push(array[i])
                    }
                }

                if(temp.length===0){
                    const message="message sent successfully"
                    const messageSent=new statusObject(success,message)
                    return {
                        ...messageSent,
                        __typename:"status"
                    }
                }
                else{
                    const message="message cannot be sent to some users"
                    const failedUserNotFound=new statusObject(failure,message)
                    failedUserNotFound.setStatusList(temp)
                    return {
                        ...failedUserNotFound,
                        __typename:"status"
                    }
                }

            }
        })
    }
})

export const updateStatus=extendType({
    type:"Mutation",
    definition(t){
        t.field("updateStatusStarred",{
            type:"statusResult",
            args:{
                mappingId:nonNull(stringArg()),
                isStarred:nonNull(booleanArg())
            },
            async resolve(root,args,ctx){

                const {userId}=ctx

                if(!userId){
                    return {
                        ...usernameNotProvided,
                        __typename:"errorType"
                    }
                }

                const mapping=await ctx.db.messages_mapping.findUnique({
                    where:{
                        mappingId:args.mappingId
                    }
                })

                if(!mapping){
                    return {
                        ...messageNotFound,
                        __typename:"errorType"
                    }
                }
                else if(mapping.username!==userId){
                    return {
                        ...unauthorizedAccess,
                        __typename:"errorType"
                    }
                }

                await ctx.db.messages_mapping.update({
                    where:{
                        mappingId:args.mappingId
                    },
                    data:{
                        isStarred:args.isStarred
                    }
                })

                const message="status updated successfully"
                const statusUpdted=new statusObject(success,message)
                return {
                    ...statusUpdted,
                    __typename:"status"
                }
                
            }

        }),

        t.field("updateStatusRead", {
            type:"statusResult",
            args:{
                mappingId:nonNull(stringArg()),
                isRead:nonNull(booleanArg())
            },
            async resolve(root,args,ctx){

                const {userId}=ctx

                if(!userId){
                    return {
                        ...usernameNotProvided,
                        __typename:"errorType"
                    }
                }

                const mapping=await ctx.db.messages_mapping.findUnique({
                    where:{
                        mappingId:args.mappingId
                    }
                })

                if(!mapping){
                    return {
                        ...messageNotFound,
                        __typename:"errorType"
                    }
                }
                else if(mapping.username!==userId){
                    return {
                        ...unauthorizedAccess,
                        __typename:"errorType"
                    }
                }

                await ctx.db.messages_mapping.update({
                    where:{
                        mappingId:args.mappingId
                    },
                    data:{
                        isRead:args.isRead
                    }
                })

                const message="status updated successfully"
                const statusUpdted=new statusObject(success,message)
                return {
                    ...statusUpdted,
                    __typename:"status"
                }
            }

        })
    }
})

export const deleteMessage=extendType({
    type:"Mutation",
    definition(t){
        
        t.field("moveToTrash",{
            type:"statusResult",
            args:{
                mappingId:nonNull(stringArg())
            },
            async resolve(root,args,ctx){

                const {userId}=ctx

                if(!userId){
                    return {
                        ...usernameNotProvided,
                        __typename:"errorType"
                    }
                }

                const mapping=await ctx.db.messages_mapping.findUnique({
                    where:{
                        mappingId:args.mappingId
                    }
                })

                if(!mapping){
                    return {
                        ...messageNotFound,
                        __typename:"errorType"
                    }
                }
                else if(mapping.username!==userId){
                    return {
                        ...unauthorizedAccess,
                        __typename:"errorType"
                    }
                }

                await ctx.db.messages_mapping.update({
                    where:{
                        mappingId:args.mappingId
                    },
                    data:{
                        attribute:"TRASH"
                    }
                })

                const message="message successfully moved to trash"
                const successfullyMoved=new statusObject(success,message)
                return {
                    ...successfullyMoved,
                    __typename:"status"
                }
            }
        }),

        t.field("deleteMessage",{
            type:"statusResult",
            args:{
                mappingId:nonNull(stringArg())
            },
            async resolve(root,args,ctx){

                const {userId}=ctx

                if(!userId){
                    return {
                        ...usernameNotProvided,
                        __typename:"errorType"
                    }
                }

                const mapping1=await ctx.db.messages_mapping.findUnique({
                    where:{
                        mappingId:args.mappingId
                    }
                })

                if(!mapping1){
                    return {
                        ...messageNotFound,
                        __typename:"errorType"
                    }
                }
                else if(mapping1.username!==userId){
                    return {
                        ...unauthorizedAccess,
                        __typename:"errorType"
                    }
                }

                await ctx.db.messages_mapping.delete({
                    where:{
                        mappingId:args.mappingId
                    }
                })

                const mapping2=await ctx.db.messages_mapping.findFirst({
                    where:{
                        messageId:mapping1.messageId
                    }
                })
                
                if(!mapping2){
                    await ctx.db.messages.delete({
                        where:{
                            messageId:mapping1.messageId
                        }
                    })
                }

                const message="message successfully deleted"
                const successfullyDeleted=new statusObject(success,message)
                return{
                    ...successfullyDeleted,
                    __typename:"status"
                }
            }
        })
    }
})

export const messageList=extendType({
    type:"Query",
    definition(t){

        t.field("messages",{
            type:"listOfMessageResult",
            args:{
                take:intArg(),
                skip:intArg(),
                attribute:stringArg(),
                isStarred:booleanArg(),
                isRead:booleanArg(),
                dateTime:dateTimeInput,
                from:stringArg(),
                to:stringArg(),
                keyward:stringArg()
            },
            async resolve(root,args,ctx){

                const {userId}=ctx


                if(!userId){
                    return {
                        ...usernameNotProvided,
                        __typename:"errorType"
                    }
                }

                const attribute=args.attribute!=null?args.attribute:undefined
                const isStarred=args.isStarred!=null?args.isStarred:undefined
                const isRead=args.isRead!=null?args.isRead:undefined
                const time=args.dateTime!=null?args.dateTime:undefined
                const take=args.take!=null?args.take:undefined
                const skip=args.skip!=null?args.skip:undefined
                const from=args.from!=null?args.from:undefined
                const to=args.to!=null?args.to:undefined
                const keyward=args.keyward!=null?args.keyward:undefined
                


                const data1=await ctx.db.messages_mapping.findMany({
                    skip:skip,
                    take:take,
                    where:{
                        AND:[
                            {
                                username:userId
                            },
                            {
                                attribute:attribute
                            },
                            {
                                isStarred:isStarred
                            },
                            {
                                isRead:isRead
                            },
                            {
                                time:time
                            },
                            {
                                messages:{
                                    AND:[
                                        {
                                            authorName:{equals:from,mode:"insensitive"}
                                        },
                                        {
                                            OR:[
                                                {subject:{contains:keyward,mode:"insensitive"}},
                                                {body:{contains:keyward,mode:"insensitive"}}
                                            ]
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    select:{
                        mappingId:true,
                        attribute:true,
                        isRead:true,
                        isStarred:true,
                        time:true,
                        messages:{
                            select:{
                                subject:true,
                                body:true,
                                authorName:true,
                                recipientName:true,
                                Cc:true,
                                Bcc:true
                            }
                        }
                    },
                    orderBy:{
                        time:"desc"
                    }
                })


                let data2=data1.map(value => {
                    const {messages,...y}=value
                    return {...messages,...y}
                })

                if(to){
                    data2=data2.filter(value => {
                        return (value.recipientName?.some(element => element.toLocaleLowerCase() === to.toLocaleLowerCase()) ||
                               value.Cc?.some(element => element.toLocaleLowerCase() === to.toLocaleLowerCase()) ||
                               value.Bcc?.some(element => element.toLocaleLowerCase() === to.toLocaleLowerCase())) 
                               
                    })
                }
                return {
                    listOfMessage:data2,
                    __typename:"listOfMessage"
                }

            }
        }),

        t.field("searchMessage",{
            type:"listOfMessageResult",
            args:{
                take:intArg(),
                skip:intArg(),
                keyward:nonNull(stringArg())
            },
            async resolve(root,args,ctx){

                let {userId}=ctx


                if(!userId){
                    return {
                        ...usernameNotProvided,
                        __typename:"errorType"
                    }
                }

                const take=args.take!=null?args.take:undefined
                const skip=args.skip!=null?args.skip:undefined
                userId=userId!=null?userId:undefined
                let keyward=`%${args.keyward}%`


                const data: Array<object>=await ctx.db.$queryRaw`select 
                "mappingId",
                "isRead",
                "isStarred",
                "attribute",
                "time",
                "authorName",
                "subject",
                "body",
                "recipientName",
                "Cc",
                "Bcc"
                from messages inner join messages_mapping on messages."messageId"=messages_mapping."messageId"
                where "username"=${userId}
                and
                ("authorName" ilike ${keyward}
                or
                "subject" ilike ${keyward}
                or
                "body" ilike ${keyward}
                or
                "recipientName"::text ilike ${keyward}
                or
                "Cc"::text ilike ${keyward}
                or
                "Bcc"::text ilike ${keyward}) order by messages_mapping."time" desc
                limit ${take} offset ${skip}`

                return {
                    listOfMessage:data,
                    __typename:"listOfMessage"
                }
            }
        })

    }
})