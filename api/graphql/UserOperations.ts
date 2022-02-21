import { extendType, nonNull, stringArg, intArg, asNexusMethod } from "nexus";

import { GraphQLDate } from "graphql-iso-date";

import bcrypt, { hash } from "bcrypt";

import { available, badUserInput, errorListObject, notAvailable, passwardWrong, statusObject, usernameNotAvailable, usernameNotProvided, userNotFound, wrongEmailFormat, wrongGenderFormat, wrongPasswardFormat, wrongPhoneNumberFormat } from ".";
import { verifyEmailFormat, verifyGenderFormat, verifyPasswardFormat, verifyPhoneNumberFormat } from "./verificationFormats";
import * as jwt from "jsonwebtoken";
import { APP_SECRET } from "../auth";


export const GQLDate = asNexusMethod(GraphQLDate, 'date');

const saltRounds = 10;


export const checkIfUnique=extendType({
    type:"Query",
    definition(t){
        t.field("checkIfUnique",{
            type:"queryResult",
            args:{
                username:nonNull(stringArg())
            },
            async resolve(root,args,ctx){

                if(!verifyEmailFormat(args.username)){
                    return {
                        ...wrongEmailFormat,
                        __typename:"errorType"
                    }
                }

                const user=await ctx.db.users.findUnique({
                    where:{
                        username:args.username
                    }
                })

                if(!user){
                    const message="username is available"
                    const usernameAvailable=new statusObject(available,message)
                    return {
                        ...usernameAvailable,
                        __typename:"status"
                    }
                }
                else{
                    const message="username not available"
                    const usernameNotAvailable=new statusObject(notAvailable,message)
                    return {
                        ...usernameNotAvailable,
                        __typename:"status"
                    }
                }
            }
        })
    }
})

export const addUser=extendType({
    type:"Mutation",
    definition(t){
        t.field("createUser",{
            type:"UserResult",
            args:{
                username:nonNull(stringArg()),
                first_name:nonNull(stringArg()),
                last_name:nonNull(stringArg()),
                passward:nonNull(stringArg()),
                phone_number:nonNull(stringArg()),
                recovery_email:stringArg(),
                birth_date:nonNull(GQLDate),
                sex:nonNull(intArg())                
            },
            async resolve(root,args,ctx){

                let errors=[]

                if(!("recovery_email" in args)){
                    args.recovery_email=null
                }


                if(args.recovery_email){
                    if(!verifyEmailFormat(args.username) || !verifyEmailFormat(args.recovery_email)){
                        errors.push(wrongEmailFormat)
                    }
                }
                else{
                    if(!verifyEmailFormat(args.username)){
                        errors.push(wrongEmailFormat)
                    }
                }

                if(!verifyPhoneNumberFormat(args.phone_number)){
                    errors.push(wrongPhoneNumberFormat)
                }

                if(!verifyPasswardFormat(args.passward)){
                    errors.push(wrongPasswardFormat)
                }

                if(!verifyGenderFormat(args.sex)){
                    errors.push(wrongGenderFormat)
                }

                if(errors.length!==0){

                    const errorList=new errorListObject(badUserInput,errors)
                    return{
                        ...errorList,
                        __typename:"error"
                    }
                }

                const user=await ctx.db.users.findUnique({
                    where:{
                        username:args.username
                    }
                })

                if(user){
                    return {
                        ...usernameNotAvailable,
                        __typename:"errorType"
                    }
                }

                const hash=await bcrypt.hash(args.passward, saltRounds)

                args.passward=hash

                const data=await ctx.db.users.create({data:args})

                const token = jwt.sign({ userId: data.username }, APP_SECRET)

                return {
                    user:data,
                    token,
                    __typename:"authPayLoad"
                }

            }
        })
    }
})

export const userLogin=extendType({
    type:"Query",
    definition(t){
        t.field("verifyUser",{
            type:"UserResult",
            args:{
                username:nonNull(stringArg()),
                passward:nonNull(stringArg())
            },
            async resolve(root,args,ctx){

                let errors=[]

                if(!verifyEmailFormat(args.username)){
                    errors.push(wrongEmailFormat)
                }

                if(!verifyPasswardFormat(args.passward)){
                    errors.push(wrongPasswardFormat)
                }

                if(errors.length!==0){
                    const errorList=new errorListObject(badUserInput,errors)
                    return {
                        ...errorList,
                        __typename:"error"
                    }
                }

                const user=await ctx.db.users.findUnique({
                    where:{
                        username:args.username
                    }
                })

                if(!user){
                    return {
                        ...userNotFound,
                        __typename:"errorType"
                    }
                }

                const valid=await bcrypt.compare(args.passward,user.passward)

                if(!valid){
                    return {
                        ...passwardWrong,
                        __typename:"errorType"
                    }
                }

                const token = jwt.sign({ userId: user.username }, APP_SECRET)

                return {
                    user,
                    token,
                    __typename:"authPayLoad"
                }
            }
        })
    }
})

export const meUser=extendType({
    type:"Query",
    definition(t){
        t.field("meUser",{
            type:"UserResult",
            async resolve(root,args,ctx){

                const {userId}=ctx

                if(!userId){
                    return {
                        ...usernameNotProvided,
                        __typename:"errorType"
                    }
                }

                const user=await ctx.db.users.findUnique({
                    where:{
                        username:userId
                    }
                })

                if(!user){
                    return {
                        ...userNotFound,
                        __typename:"errorType"
                    }
                }


                const token = jwt.sign({ userId: user.username }, APP_SECRET)

                return {
                    user,
                    token,
                    __typename:"authPayLoad"
                }
            }
        })
    }
})
