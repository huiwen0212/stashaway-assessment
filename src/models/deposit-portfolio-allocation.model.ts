import { Model } from "objection";

export enum PortfolioEnum {
  RETIREMENT = "retirement",
  HIGH_RISK = "high_risk",
  GENERAL = "general",
}

export interface DepositPortfolioAllocation {
  id?: number;
  depositId: number;
  userId: string;
  portfolioType: PortfolioEnum;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DepositPortfolioAllocationModel
  extends DepositPortfolioAllocation {}

export class DepositPortfolioAllocationModel extends Model {
  static get tableName() {
    return "deposits_portfolio_allocation";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["depositId", "portfolioType", "amount"],
      properties: {
        id: { type: "number" },
        depositId: { type: "number" },
        userId: { type: "string" },
        portfolioType: { type: "string" },
        amount: {
          type: "number",
          minimum: 0,
        },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
      },
    };
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString().slice(0, 19).replace("T", " ");
  }
}
export default DepositPortfolioAllocationModel;
