import { Model } from "objection";
import CommonUtils from "../utils/common.util";

export interface Users {
  id?: number;
  name: string;
  referenceCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersModel extends Users {}

export class UsersModel extends Model {
  static get tableName() {
    return "users";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "reference_code"],
      properties: {
        id: { type: "number" },
        name: { type: "string" },
        referenceCode: { type: "string" },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
      },
    };
  }

  $beforeInsert() {
    this.referenceCode = CommonUtils.generateRandomString(10);
    this.createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString().slice(0, 19).replace("T", " ");
  }
}
export default UsersModel;
