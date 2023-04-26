process.env.ENVIRONMENT = "test";

import request from "supertest";
import { app, server } from "../src/index";
import { knex } from "../src/db/db.module";
import { StatusCodes } from "http-status-codes";
import { PortfolioEnum } from "../src/models/deposit-portfolio-allocation.model";
import { DepositTypeEnum } from "../src/models/deposit.model";

describe("Token Controller", () => {
  beforeAll(async () => {
    console.log("prepare & running the migrations...");
    await knex.migrate.latest();
    console.log("migration complete... running seed");
    await knex.seed.run();
    console.log("seed complete...");
    // await knex.seed.run();
    // Mock API Key
    // app.locals.API_KEY = MOCK_API_KEY;
  });

  afterAll(async () => {
    console.log("rolling back all of migrations...");
    await knex.migrate.rollback();
    console.log("rollback complete");
    await server.close();
    await knex.destroy();
  });

  it("should success add one time and monthly deposit", async () => {
    const bodyRequest = {
      user_id: "1",
      bank_name: "cimb",
      bank_card_number: "1234123412341234",
      deposit_amount: 10500,
      deposit_type: DepositTypeEnum.ONE_TIME,
      deposit_date: "2023-04-23",
      deposit_to_plans: [
        {
          amount: 10000,
          portfolio: PortfolioEnum.HIGH_RISK,
        },
        {
          amount: 500,
          portfolio: PortfolioEnum.RETIREMENT,
        },
      ],
    };
    const oneTimeDepositResult = await request(app)
      .post(`/deposit/add-deposit`)
      .send(bodyRequest);

    expect(oneTimeDepositResult.status).toBe(StatusCodes.OK);

    expect(oneTimeDepositResult.body.message).toBe(
      "Deposit added successfully"
    );

    expect(
      JSON.stringify(oneTimeDepositResult.body.data.deposit_allocation_balance)
    ).toBe(
      JSON.stringify({
        high_risk: 10000,
        retirement: 500,
      })
    );

    const monthlyDepositBodyRequest = {
      user_id: "1",
      bank_name: "cimb",
      bank_card_number: "1234123412341234",
      deposit_amount: 100,
      deposit_type: DepositTypeEnum.MONTHLY,
      deposit_date: "2023-04-23",
      deposit_to_plans: [
        {
          amount: 100,
          portfolio: PortfolioEnum.RETIREMENT,
        },
      ],
    };
    const monthlyDepositResult = await request(app)
      .post(`/deposit/add-deposit`)
      .send(monthlyDepositBodyRequest);

    expect(
      JSON.stringify(monthlyDepositResult.body.data.deposit_allocation_balance)
    ).toBe(
      JSON.stringify({
        high_risk: 10000,
        retirement: 600,
      })
    );
  });

  it("should fail if user does not exist", async () => {
    const bodyRequest = {
      user_id: "3",
      bank_name: "cimb",
      bank_card_number: "1234123412341234",
      deposit_amount: 10500,
      deposit_type: "one_time",
      deposit_date: "2023-04-23",
      deposit_to_plans: [
        {
          amount: 10000,
          portfolio: PortfolioEnum.HIGH_RISK,
        },
        {
          amount: 500,
          portfolio: PortfolioEnum.RETIREMENT,
        },
      ],
    };
    const result = await request(app)
      .post(`/deposit/add-deposit`)
      .send(bodyRequest);

    expect(result.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
  });
});
