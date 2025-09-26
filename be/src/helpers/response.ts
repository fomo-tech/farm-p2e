import { BadRequestResponse, SuccessMsgResponse } from "../core/ApiResponse";

import { Response } from "express";
import { translateText } from "./translator";
import { LanguageCode } from "open-google-translator";


export const sendTranslatedError = async (
  res: Response,
  message: string,
  lang: LanguageCode = "vi"
) => {
  const translated = await translateText(message, lang);
  return new BadRequestResponse(translated).send(res);
};


export const sendTranslatedSuccess = async (
  res: Response,
  message: string,
  lang: LanguageCode = "vi"
) => {
  const translated = await translateText(message, lang);
  return new SuccessMsgResponse(translated).send(res);
};