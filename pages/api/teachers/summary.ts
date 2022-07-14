import { NextApiHandler } from 'next';
import { Lesson } from '@/domain/lesson';
import { ApiResponse, extractSearchFilter, extractSearchOptions, HandlerCollection } from '@/utils/api';
import { HttpCode } from '@/utils/http';
import { Prisma, PrismaClient } from '@prisma/client';
import prisma from 'db/prisma';

const handler: NextApiHandler = async (req, res) => {
    const requestHandler = requestHandlers[req.method];
    if (!requestHandler) return res.status(HttpCode.METHOD_NOT_ALLOWED).end();
    return await requestHandler(req, res);
};

const getHandler: NextApiHandler = async (req, res) => {
    const prismaSql = Prisma.sql`
        -- Complete task 3 here
    `;
    const result = await prisma.$queryRaw<unknown>(prismaSql);
    return res.status(HttpCode.OK).json({ result });
};

const requestHandlers: HandlerCollection = {
    GET: getHandler,
};

export default handler;
