import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { createAuthMiddleware } from "better-auth/api";
import { UserRoles } from "../../generated/prisma/enums";
import sendVerificationEmail from "../utils/sendVerificationEmail";




export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins : [process.env.APP_URL!], 
    user : {
        additionalFields : {
           role : {
            type : "string",
            required : true
           },
           status : {
            type : "string",
            defaultValue : "ACTIVE",
            required : false
           },
        }
    },

    emailAndPassword: { 
        enabled: true,
        autoSignIn : false,
        requireEmailVerification : true
    },

    emailVerification : {
        sendVerificationEmail : async ({ user, url, token }) => {
            sendVerificationEmail({ user: { ...user, image: user.image ?? null } , url, token })
        },
        
    },
    
    socialProviders: {
        google: { 
            prompt : "select_account consent",
            accessType : "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }, 
    },
    hooks : {
        before : createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-up/email") {
                if (ctx.body.role === UserRoles.ADMIN) {
                    throw new APIError("BAD_REQUEST", {
                        message : "You can't sign up as admin"
                    });
                }
            }
        })
    }
});