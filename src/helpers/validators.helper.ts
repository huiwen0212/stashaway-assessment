import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import StatusCode from "http-status-codes";

/**
 * Main error message response format
 * @param errorMessage
 * @returns
 */
export const errorMsg = (errorMessage: string): { error: string } => ({
  error: errorMessage,
});

/**
 * Main express validator error message return
 * @param req Express Request
 * @param res Express Response
 * @param next Express Next Function
 * @returns
 */
export const errorValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const error: any = errors.array()[0];

  return res
    .status(StatusCode.UNPROCESSABLE_ENTITY)
    .json(errorMsg(`${error["path"]} : ${error.msg}`));
};
