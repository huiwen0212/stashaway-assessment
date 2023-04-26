import { Knex } from "knex";
import CommonUtils from "../src/utils/common.util";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    {
      id: 1,
      name: "Hui Wen",
      email: "huiwen@gmail.com",
      reference_code: CommonUtils.generateRandomString(10),
    },
    {
      id: 2,
      name: "John",
      email: "john@gmail.com",
      reference_code: CommonUtils.generateRandomString(10),
    },
  ]);
}
