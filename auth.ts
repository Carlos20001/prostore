import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import {prisma} from '@/db/prisma'
import CredentialProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';

const config = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session : {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialProvider({
            credentials: {
                email: { type: 'email'},
                password: { type: 'password'}
            }, 
            async authorize(credentials){
                if(credentials === null) return null;

                // find uer in database
                const user = await prisma.user.findFirst({
                    where: {
                        email:credentials.email as string
                    }
                })
                // check if user exists and password matches
                if(user && user.password) {
                    const isMatch = compareSync(credentials.password as string, user.password);
                   //If password is correct return user
                   if(isMatch){
                    return {
                        id:user.id,
                        name:user.name,
                        email:user.email,
                        role:user.role
                    }
                   }
                }
                return null;
            }
        }),
    ],
    callbacks: {
        async session({ session, user, trigger, token }) {
            //set user id from token 
            session.user.id = token.sub ?? '';
            // If there is an update, set the user name
            if(trigger === 'update') {
                session.user.name = user.name
            }

            return session
    }
}
} satisfies NextAuthConfig


export const {handlers, auth, signIn, signOut} = NextAuth(config);