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

/*
* TODOS: the business logic of the summary should in teacher service; the controller is just for validating, formating the input and then pass args into the service 
*/
const getHandler: NextApiHandler = async (req, res) => {

    const prismaSql = Prisma.sql`
    SELECT 
        t.id,
        t.title,
        t."teacherName",
        t."roomName",
        l.lessons,
        case
            when l.lessons >= 10 then 'Full-time'
        else 
            'Casual'
        end as type
    FROM(
        SELECT 
            t.id,
            t.title, 
            t.name as "teacherName",
            r."name" as "roomName", 
            count(l."roomId") as cnt,
            ROW_NUMBER() OVER (PARTITION BY r."name" ORDER BY COUNT(*) DESC) as seqnum
        FROM 
            "Lesson" l 
            JOIN "Teacher" t ON l."teacherId" = t.id 
            JOIN "Room" r ON l."roomId" = r.id 
        GROUP BY
            t.id, t.title, t.name, r.name
    ) t,
    (
        SELECT 
            l."teacherId",
            count(l.id) as lessons
        FROM 
            "Lesson" l
        GROUP BY
            l."teacherId"            
    ) l  
    WHERE 
        1 = 1
        AND t.seqnum = 1   
        AND t.id = l."teacherId"
    `;
    const result = await prisma.$queryRaw<unknown>(prismaSql);
    return res.status(HttpCode.OK).json({ result });
};

const requestHandlers: HandlerCollection = {
    GET: getHandler,
};

export default handler;
