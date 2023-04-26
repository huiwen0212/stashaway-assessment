import { Model } from "objection";

export enum DepositTypeEnum {
  ONE_TIME = "one_time",
  MONTHLY = "monthly",
}

export enum DepositStatus {
  PROCESSING = "processing",
  APPROVED = "approved",
}

export interface Deposits {
  id?: number;
  userId: string;
  depositType: DepositTypeEnum;
  amount: number;
  bankName: string;
  bankCardNumber: string;
  depositStatus?: DepositStatus;
  depositDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DepositsModel extends Deposits {}

export class DepositsModel extends Model {
  static get tableName() {
    return "deposits";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "userId",
        "depositType",
        "amount",
        "bankName",
        "bankCardNumber",
      ],
      properties: {
        id: { type: "number" },
        userId: { type: "string" },
        depositType: { type: "string" },
        amount: {
          type: "number",
          minimum: 0,
        },
        bankName: { type: "string" },
        bankCardNumber: { type: "string" },
        depositStatus: { type: "string" },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
      },
    };
  }

  $beforeInsert() {
    this.depositStatus = DepositStatus.PROCESSING;
    this.createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString().slice(0, 19).replace("T", " ");
  }
}
export default DepositsModel;
