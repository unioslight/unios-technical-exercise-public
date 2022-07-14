import { NextApiHandler } from 'next';
import { HttpMethod } from './http';

export interface ApiResponse<T> {
    data: T;
    //Other standard response properties here
}

export type HandlerCollection = {
    [key in HttpMethod]?: NextApiHandler;
};

export type SearchOptions<T> = {
    take?: number;
    cursor?: number;
    skip?: number;
    orderBy: keyof T;
    sortDirection: SortDirection;
};

export type PrismaSearchOptions = {
    cursor: { id: number } | null;
    take: number | null;
    skip: number | null;
    orderBy: { [key: string]: 'asc' | 'desc' };
};

export type SearchFilter<T> = {
    [K in keyof T]: T[K];
};

export type SortDirection = 'asc' | 'desc';

/**
 * Receives a `query` object extracted from a NextApiRequest, interrogates it for
 * `searchOptions`, and returns a valid SearchOptions object with appropriate defaults
 * @param query Query object from the NextApiRequest `req` object
 * @returns {SearchOptions<T>}
 */
export const extractSearchOptions = <T>(query: { [key: string]: string | string[] }): PrismaSearchOptions => {
    if ([null, undefined].includes(query?.searchOptions)) return {} as PrismaSearchOptions;
    const opts = JSON.parse(query?.searchOptions as string) as SearchOptions<T>;

    return {
        cursor: { id: opts.cursor } || null,
        take: opts?.take ? Number(opts?.take) : null,
        skip: opts?.skip ? Number(opts?.skip) : null,
        orderBy: opts?.orderBy ? { [opts.orderBy]: opts?.sortDirection || 'asc' } : null,
    };
};

/**
 * Receives a `query` object extracted from a NextApiRequest, interrogates it for
 * `filters`, and returns a typed SearchOptions object
 * @param query Query object from the NextApiRequest `req` object
 * @returns {SearchFilter<T>}
 */
export const extractSearchFilter = <T>(query: { [key: string]: string | string[] }): SearchFilter<T> => {
    if ([null, undefined].includes(query?.filters)) return {} as SearchFilter<T>;
    return JSON.parse(query?.filters as string) as SearchFilter<T>;
};
