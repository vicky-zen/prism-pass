import { getCacheError } from "../cache/error.js";

interface IResult {
  code: string;
  value: string;
}

export async function getErrors(errorCodes: string[], langCode = "en") {
  try {
    const errorPromises = errorCodes.map(async (err) => {
      let errObj = await getCacheError(langCode, err);
      if (!errObj) {
        return { code: err, value: "Error value not found" };
      }
      return { code: errObj.errorCode, value: errObj.errorMessage };
    });

    const result: IResult[] = await Promise.all(errorPromises);
    return result;
  } catch (error) {
    console.error("Error occurred while fetching error messages:", error);
    return [];
  }
}
