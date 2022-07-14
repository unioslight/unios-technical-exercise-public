import { NextApiHandler } from 'next';
import { Teacher } from '@/domain/teacher';
import { ApiResponse, HandlerCollection } from '@/utils/api';
import { HttpCode } from '@/utils/http';
import prisma from 'db/prisma';

const handler: NextApiHandler = async (req, res) => {
    const requestHandler = requestHandlers[req.method];
    if (!requestHandler) return res.status(HttpCode.METHOD_NOT_ALLOWED).end();
    return await requestHandler(req, res);
};

const getHandler: NextApiHandler<ApiResponse<Teacher>> = async (req, res) => {
    try {
        const id = Number(req?.query?.id);
        const data = await prisma.teacher.findUnique({ where: { id } });

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
        const update = req?.body as Teacher;
        await prisma.teacher.update({ where: { id }, data: update });

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
        await prisma.teacher.delete({ where: { id } });

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
