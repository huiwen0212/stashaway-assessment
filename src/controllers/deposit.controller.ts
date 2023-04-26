import { StatusCodes } from "http-status-codes";
import { Deposits, DepositsModel } from "../models/deposit.model";
import HttpError from "http-errors";
import HttpStatus from "http-status-codes";
import { Request, Response } from "express";
import { Logger } from "../lib/logger";
import { AddDepositRequest } from "../interfaces/request/add-deposit.request";
import DepositPortfolioAllocationModel, {
  DepositPortfolioAllocation,
} from "../models/deposit-portfolio-allocation.model";

namespace DepositController {
  /**
   * Insert Portfolio Deposit and return the balance
   * @param params
   * @returns
   */
  export async function addDeposit(req: Request, res: Response) {
    const {
      user_id,
      bank_name,
      bank_card_number,
      deposit_amount,
      deposit_type,
      deposit_date,
      deposit_to_plans,
    }: AddDepositRequest = req.body;

    try {
      if (deposit_to_plans.length <= 0) {
        throw new Error(
          `Deposit Portfolio Plan cannot be empty, please enter which portfolio do you want to deposit to.`
        );
      }
      const depositsData: Deposits = {
        userId: user_id,
        depositType: deposit_type,
        bankName: bank_name,
        bankCardNumber: bank_card_number,
        depositDate: deposit_date,
        amount: deposit_amount,
      };

      const depositData = await DepositsModel.query()
        .insert(depositsData)
        .catch((e) => {
          throw new Error(`Fail to insert deposit record, ${e}`);
        });

      if (!depositData.id) {
        Logger.error(
          "depositData id not found.Failed to insert deposit portfolio allocation."
        );
        throw new Error(
          `Deposit Id not found. Failed to insert deposit portfolio allocation.`
        );
      }

      for (const depositPlan of deposit_to_plans) {
        const depositPortfolioAllocation: DepositPortfolioAllocation = {
          userId: user_id,
          depositId: depositData.id,
          portfolioType: depositPlan.portfolio,
          amount: depositPlan.amount,
        };

        await DepositPortfolioAllocationModel.query()
          .insert(depositPortfolioAllocation)
          .catch((e) => {
            throw new Error(
              `Fail to insert deposit portfolio allocation for Deposit ID: ${depositData.id} Portfolio: ${depositPlan.portfolio}. ${e}`
            );
          });
      }

      const userDepositData = await DepositPortfolioAllocationModel.query()
        .where({
          user_id: user_id,
        })
        .catch((e) => {
          throw new Error(
            `Fail to  query deposit portfolio allocation for user id ${user_id}. ${e}`
          );
        });

      const depositAllocationBalance: { [key: string]: number } = {};
      if (userDepositData.length > 0) {
        for (const deposit of userDepositData) {
          // If Portfolio type exist add the amount, else portfolio amount will be the current amount
          if (depositAllocationBalance[deposit.portfolioType]) {
            depositAllocationBalance[deposit.portfolioType] += Number(
              deposit.amount
            );
          } else {
            depositAllocationBalance[deposit.portfolioType] = Number(
              deposit.amount
            );
          }
        }
      } else {
        throw new Error("Empty User Deposit Data");
      }

      return res.status(StatusCodes.OK).json({
        message: "Deposit added successfully",
        data: { deposit_allocation_balance: depositAllocationBalance },
      });
    } catch (e) {
      Logger.error(`Fail to add deposit, ${e}`);
      throw HttpError(HttpStatus.BAD_REQUEST, "Fail to add deposit");
    }
  }
}

export default DepositController;
