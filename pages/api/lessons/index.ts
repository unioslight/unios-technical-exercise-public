import { NextApiHandler } from 'next';
import { Lesson } from '@/domain/lesson';
import { ApiResponse, extractSearchFilter, extractSearchOptions, HandlerCollection } from '@/utils/api';
import { HttpCode } from '@/utils/http';
import { PrismaClient } from '@prisma/client';
import prisma from 'db/prisma';

const handler: NextApiHandler = async (req, res) => {
    const requestHandler = requestHandlers[req.method];
    if (!requestHandler) return res.status(HttpCode.METHOD_NOT_ALLOWED).end();
    return await requestHandler(req, res);
};

const getHandler: NextApiHandler = async (req, res) => {
    throw new Error('Not implemented.');
};

const postHandler: NextApiHandler = async (req, res) => {
    throw new Error('Not implemented.');
};

const requestHandlers: HandlerCollection = {
    GET: getHandler,
    POST: postHandler,
};

export default handler;
