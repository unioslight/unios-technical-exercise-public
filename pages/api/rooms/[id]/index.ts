import { NextApiHandler } from 'next';
import { Room } from '@/domain/room';
import { ApiResponse, HandlerCollection } from '@/utils/api';
import { HttpCode } from '@/utils/http';
import prisma from 'db/prisma';

const handler: NextApiHandler = async (req, res) => {
    const requestHandler = requestHandlers[req.method];
    if (!requestHandler) return res.status(HttpCode.METHOD_NOT_ALLOWED).end();
    return await requestHandler(req, res);
};

const getHandler: NextApiHandler<ApiResponse<Room>> = async (req, res) => {
    try {
        const id = Number(req?.query?.id);

        const data = await prisma.room.findUnique({ where: { id } });

        if (data === null) return res.status(HttpCode.NOT_FOUND).end();

        return res.status(HttpCode.OK).json({ data });
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
        const update = req?.body as Room;

        await prisma.room.update({ where: { id }, data: update });

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
        await prisma.room.delete({ where: { id } });

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
