import { Request, Response } from "express";

import { NextFunction, Router } from "express";
import DepositController from "../controllers/deposit.controller";
import { DepositTypeEnum } from "../models/deposit.model";
import { body } from "express-validator";

const DepositRouter: Router = Router();
const wrap = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = fn(req, res, next);
    return result.catch(next);
  } catch (err) {
    return next(err);
  }
};

import { errorValidation } from "../helpers/validators.helper";
import UsersModel from "../models/user.model";
// export a wrapper that catches errors and passes it to next(),
// so we can write cleaner code
export function wrapAsync(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
}
DepositRouter.post(
  "/add-deposit",
  [
    body("user_id")
      .isString()
      .custom(async (value) => {
        const user = await UsersModel.query().findById(value);
        if (!user) {
          throw new Error("User not found");
        }
      }),
    body(
      "bank_name",
      "Bank Name need to be string and cannot be empty"
    ).isString(),
    body(
      "bank_card_number",
      "Bank Card Number need to be numeric and cannot be empty"
    )
      .isNumeric()
      .isLength({ min: 16, max: 16 })
      .withMessage("Bank Card number need to be 16 characters long"),
    body(
      "deposit_amount",
      "Deposit Amount need to be numeric value and cannot be empty"
    ).isNumeric(),
    body("deposit_type", `Deposit Type is empty`)
      .isIn(Object.values(DepositTypeEnum))
      .withMessage(`Deposit Type is not ${Object.values(DepositTypeEnum)}`),
    body("deposit_date", "Invalid Deposit Date").isString(),
    body("deposit_to_plans").isArray(),
  ],
  errorValidation,
  wrapAsync(DepositController.addDeposit)
);

export default DepositRouter;
