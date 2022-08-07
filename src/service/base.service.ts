import { PrismaClient, Prisma } from '@prisma/client';
import prisma from 'db/prisma';

export default class BaseService{

    protected _prisma = prisma;
    protected _Prisma = Prisma;
    protected _PrismaClient = PrismaClient;         
    serviceName: string;

    constructor(serviceName: string){
        this.serviceName = serviceName;
    }

    protected _log(...args){
        console.log(`${this.serviceName} > INFO: `, ...args);
    }

    protected _debug(...args){
        console.log(`${this.serviceName} > DEBUG: `, ...args);
    }

}
