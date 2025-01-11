import { Request } from "express";
import { logger } from "../middleware/index.js";
import { API_Response, Status } from "./index.js";
import { getErrors } from "./errorHandler.js";


export interface ApiErrorStructure {
    code: string,
    error: string,
    subCode: string,
    subError: string;
}


export const getErrorRes = async <T>(
    err: T,
    req: Request,
    route: string
) => {
    if (!err['errCode'] || err['message'])
        logger.error("unHandleError", {
            error: err['message'] ?? "",
            route: route,
            stacktrace: err, request: req.body
        });
    const langCode = req.header("Accept-Language");
    const errors = await getErrors(
        err['errCode'],
        langCode
    );
    const apiResponse = getApiErrorRes(
        errors.length
            ? errors
            : [{
                code: "UHL01",
                value: err['message'] ?? "error unhandled"
            }]);
    logger.warn(
        `error occurred in ${ route.split('/')[route.split('/').length - 1] }`, {
        error: errors,
        request: req.body
    });
    return apiResponse;
};

export const getApiSuccessRes = <T>(
    data: T
) => {
    const apiResponse = new API_Response<T, null>();
    apiResponse.data = data;
    apiResponse.status = Status.Success;
    return apiResponse;
};

const getApiErrorRes = <T>(error: T[]) => {
    const res = new API_Response();
    res.status = Status.Error;
    res.error = error;
    return res;
};



export const apiErrorHandling = async <T>(
    err: T,
    req: Request,
    path: string
) => {
    const splittedPath = path.split('/');
    if (!err['errCode'] && !err['SubCode'])
        logger.error(`unknown -> error occurred in api ${ splittedPath[splittedPath.length - 1] }`, {
            error: err['message'] || "",
            route: path,
            stacktrace: err,
            request: req.body
        });
    const langCode = req.header("Accept-Language");
    const errors = await getErrors(err['errCode'], langCode);
    let subErrors = [{
        code: "UNK",
        value: "unknown"
    }];
    if (err['subCode'])
        subErrors = await getErrors(err['subCode'], langCode);

    const allErrors: ApiErrorStructure[] = [];
    subErrors.forEach(err => {
        if (err.code != "UNK01")
            allErrors.push(
                getReturnApiError(errors[0], err)
            );
        else {
            allErrors.push(
                getReturnApiError(errors[0], {
                    code: err.code,
                    value: err['error']['message'] || "unknown"
                }));
        }
    });
    const res = new API_Response<undefined, ApiErrorStructure>();
    res.status = Status.Error;
    res.error = err['errCode'] || err['subCode']
        ? allErrors
        : [{
            code: "UNK",
            error: "unknown",
            subCode: "",
            subError: err['message']
        }];
    if (err['errCode'] || err['SubCode'])
        logger.warn(`error occurred in api ${ splittedPath[splittedPath.length - 1] }`, {
            error: allErrors,
            request: req.body
        });
    return res;
};

export const getReturnApiError = <T, P>(
    mainError: T,
    subError: P
): ApiErrorStructure => {
    const errRes: ApiErrorStructure = {
        code: "UNK",
        error: "unknown",
        subCode: subError['code'],
        subError: subError['value']
    };
    if (mainError) {

        errRes.error = mainError['value'];
        errRes.code = mainError['code'];
    }

    return errRes;
};