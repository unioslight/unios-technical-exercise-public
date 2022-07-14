import { NextApiHandler } from 'next';
import { Room } from '@/domain/room';
import { ApiResponse, extractSearchFilter, extractSearchOptions, HandlerCollection } from '@/utils/api';
import { HttpCode } from '@/utils/http';
import prisma from 'db/prisma';

const handler: NextApiHandler = async (req, res) => {
    const requestHandler = requestHandlers[req.method];
    if (!requestHandler) return res.status(HttpCode.METHOD_NOT_ALLOWED).end();
    return await requestHandler(req, res);
};

const getHandler: NextApiHandler<ApiResponse<Room[]>> = async (req, res) => {
    try {
        const filters = extractSearchFilter<Room>(req.query);
        const options = extractSearchOptions<Room>(req.query);

        const data = await prisma.room.findMany({ where: filters, ...options });

        return res.status(HttpCode.OK).json({ data });
    } catch (e) {
        const message = `An unhandled error occurred in 'GET: ${req.url}: ${e?.message || 'Unknown error'}`;
        console.error(message);

        res.statusMessage = message;
        return res.status(HttpCode.INTERNAL_SERVER_ERROR).end();
    }
};

const postHandler: NextApiHandler = async (req, res) => {
    try {
        const data = req?.body as Room;
        await prisma.room.create({ data });

        return res.status(HttpCode.CREATED).end();
    } catch (e) {
        const message = `An unhandled error occurred in 'POST: ${req.url}: ${e?.message || 'Unknown error'}`;
        console.error(message);

        res.statusMessage = message;
        return res.status(HttpCode.INTERNAL_SERVER_ERROR).end();
    }
};

const requestHandlers: HandlerCollection = {
    GET: getHandler,
    POST: postHandler,
};

export default handler;
