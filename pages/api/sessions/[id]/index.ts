import { NextApiHandler } from 'next';
import { Session } from '@/domain/session';
import { ApiResponse, HandlerCollection } from '@/utils/api';
import { HttpCode } from '@/utils/http';
import prisma from 'db/prisma';

const handler: NextApiHandler = async (req, res) => {
    const requestHandler = requestHandlers[req.method];
    if (!requestHandler) return res.status(HttpCode.METHOD_NOT_ALLOWED).end();
    return await requestHandler(req, res);
};

const getHandler: NextApiHandler<ApiResponse<Session>> = async (req, res) => {
    try {
        const id = Number(req?.query?.id);
        const data = await prisma.session.findUnique({ where: { id } });

        if (data === null) return res.status(HttpCode.NOT_FOUND).end();

        const payload = {
            data,
            page: 1,
            pageSize: 1,
            totalRecords: 1,
        };

        return res.status(HttpCode.OK).json(payload);
    } catch (e) {
        const message = `An unhandled error occurred in 'GET: ${req.url}: ${e?.message || 'Unknown error'}`;
        console.error(message);

        res.statusMessage = message;
        return res.status(HttpCode.INTERNAL_SERVER_ERROR).end();
    }
};

const putHandler: NextApiHandler = async (req, res) => {
    try {
        const id = Number(req?.query?.id);
        const update = req?.body as Session;
        await prisma.session.update({ where: { id }, data: update });

        return res.status(HttpCode.OK).end();
    } catch (e) {
        const message = `An unhandled error occurred in 'PUT: ${req.url}: ${e?.message || 'Unknown error'}`;
        console.error(message);

        res.statusMessage = message;
        return res.status(HttpCode.INTERNAL_SERVER_ERROR).end();
    }
};

const deleteHandler: NextApiHandler = async (req, res) => {
    try {
        const id = Number(req?.query?.id);
        await prisma.session.delete({ where: { id } });

        return res.status(HttpCode.OK).end();
    } catch (e) {
        const message = `An unhandled error occurred in 'DELETE: ${req.url}: ${e?.message || 'Unknown error'}`;
        console.error(message);

        res.statusMessage = message;
        return res.status(HttpCode.INTERNAL_SERVER_ERROR).end();
    }
};

const requestHandlers: HandlerCollection = {
    GET: getHandler,
    PUT: putHandler,
    DELETE: deleteHandler,
};

export default handler;
