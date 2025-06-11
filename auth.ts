import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import {prisma} from '@/db/prisma'
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts-edge';
import { authConfig } from './auth.config';

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });
       // check if user exists and password matches
         if (user && user.password) {
            const isMatch = await compare(
            credentials.password as string,
            user.password
          );
                   //If password is correct return user
                   if(isMatch){
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    }
                   }
                }
                return null;
            }
        }),
    ],
    callbacks: {
        async session({ session, user, trigger, token } : any) {
            //set user id from token 
              session.user.id = token.sub;
              session.user.role = token.role;
             session.user.name = token.name;
            

            // If there is an update, set the user name
            if(trigger === 'update') {
                session.user.name = user.name
            }

            return session
    }, 
    async jwt({ token, user, trigger, session}: any) {
      //assign user field to token
      if(user) {
        token.role = user.role

        //if user has no name then use email
        if(user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0]
        }
        // update the database to reflect the token name
        await prisma.user.update({
          where: {id: user.id},
          data: {name: token.name}
        })

      }
      return token;
    },
   ...authConfig.callbacks,

    }
}



export const {handlers, auth, signIn, signOut} = NextAuth(config);