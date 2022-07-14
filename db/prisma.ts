import { PrismaClient } from '@prisma/client';
import { env } from 'process';

/*
    There is a known issue surrounding prisma client exhausting available db 
    connections when used with next.js api routes in dev environments. The 
    solution here creates a singleton client to be shared across the application.
    - See here:  https://pris.ly/d/help/next-js-best-practices
    - And here:  https://dev.to/noclat/fixing-too-many-connections-errors-with-database-clients-stacking-in-dev-mode-with-next-js-3kpm

    The 'server-side only' condition allows us to co-locate client and server
    functions and import them client-side without throwing the corresponding
    Prisma error.
    - See here:  https://github.com/prisma/prisma/issues/5795#issuecomment-840677290
*/

let prisma: PrismaClient;

if (typeof window === typeof undefined) {
    if (process.env.NODE_ENV === 'production') {
        prisma = new PrismaClient();
    } else {
        if (!global.prisma) {
            global.prisma = new PrismaClient();
        }

        prisma = global.prisma;
    }
}

export default prisma;
