import { NextApiHandler } from 'next';
import { HandlerCollection } from '@/utils/api';
import { HttpCode } from '@/utils/http';
import LessonService from '../../../src/service/lesson.service';

const handler: NextApiHandler = async (req, res) => {
    const requestHandler = requestHandlers[req.method];
    if (!requestHandler) return res.status(HttpCode.METHOD_NOT_ALLOWED).end();
    return await requestHandler(req, res);
};

const getHandler: NextApiHandler = async (req, res) => {
    throw new Error('Not implemented.');
};

const requiredValidation = (data: any, fieldName: string) => {
    
    const value = data ? data[fieldName] : null;

    if( !value || value === ''){
        throw new Error(`Field (${fieldName}) is required in the body`)
    }

    return true;
}

const postHandler: NextApiHandler = async (req, res) => {
    try {
        const data = JSON.parse(req?.body);

        console.log('DEBUG > postHandler > data = ', data);

        requiredValidation(data, 'name');
        requiredValidation(data, 'teacher');
        requiredValidation(data, 'day');
        requiredValidation(data, 'hour');
        requiredValidation(data, 'room');
        const { name, day, hour, room } = data;
        const teacherId = Number(data.teacher);
        const roomId = Number(data.room);

        const lessonService = new LessonService();
        const lessonId = await lessonService.create({teacherId, roomId, name, day, hour});

        return res.status(HttpCode.CREATED).json(lessonId)
    } catch (e) {

        console.error('error = ',e);
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
