import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import {prisma} from '@/db/prisma'
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts-edge';
import { authConfig } from './auth.config';
import { cookies } from 'next/headers';
import { CartItem } from './types';

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
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
 
        // If user has no name then use the email
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];
 
          // Update database to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
 
        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;
 
          if (sessionCartId) {
            // Find both the session cart and user's existing cart
            const [sessionCart, userCart] = await Promise.all([
              prisma.cart.findFirst({
                where: { sessionCartId },
              }),
              prisma.cart.findFirst({
                where: { userId: user.id },
              })
            ]);
 
            if (sessionCart) {
              // If user has an existing cart, delete it
              if (userCart) {
                await prisma.cart.delete({
                  where: { id: userCart.id }
                });
              }
 
              // Use upsert to safely handle the cart update
              await prisma.cart.upsert({
                where: { id: sessionCart.id },
                update: { userId: user.id },
                create: {
                  id: sessionCart.id,
                  userId: user.id,
                  sessionCartId: sessionCartId,
                  items: sessionCart.items as CartItem[],
                  itemsPrice: sessionCart.itemsPrice,
                  totalPrice: sessionCart.totalPrice,
                  shippingPrice: sessionCart.shippingPrice,
                  taxPrice: sessionCart.taxPrice,
                }
              });
            } else if (!userCart) {
              // If no session cart and no user cart, create a new cart
              await prisma.cart.create({
                data: {
                  userId: user.id,
                  sessionCartId: sessionCartId,
                  items: [],
                  itemsPrice: 0,
                  totalPrice: 0,
                  shippingPrice: 0,
                  taxPrice: 0,
                },
              });
            }
          }
        }
      }
 
      // Handle session updates
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;
      }
 
      return token;
    },
   ...authConfig.callbacks,

    }
}



export const {handlers, auth, signIn, signOut} = NextAuth(config);