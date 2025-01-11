import { AppDataSource } from '../server.js';
import { ErrorTexts } from '../entities/public/ErrorTexts.entity.js';
import { CacheManagement } from './cacheManagement.js';


const fetchData = async () => {
    return await AppDataSource
        .getRepository(ErrorTexts)
        .find();
};

const cache = new CacheManagement<ErrorTexts>(
    'error',
    fetchData
);

export const cacheErrorsStart = () => cache.startFun();
export const getAllCacheErrors = () => cache.getAll();
export const getCacheError = async (langCode: string,
    err: string) => {
    const errors = await cache.getAll();
    const foundErrors = errors.find(error =>
        error.languageCode == langCode
        && error.errorCode == err
    );
    return foundErrors;
};