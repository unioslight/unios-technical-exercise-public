import { PrismaClient, Prisma } from '@prisma/client';
import prisma from 'db/prisma';

/*
* TODOS: 
* - implement the log service
* - create the config folder in /src; then create the config data for each envs: base.ts; dev.ts; stg.ts; prd.ts ... and have a helper to create the config for running env;
*.  the confg the is set into baseservice      
*/
export default class BaseService{
    
    protected _config;
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
