// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import Knex from "knex";
import * as knexConfig from "../../knexfile";
import { Model, knexSnakeCaseMappers } from "objection";

const env = process.env.ENVIRONMENT!;

if (
  env !== "production" &&
  env !== "development" &&
  env !== "local" &&
  env !== "test"
)
  throw new Error("Invalid APP_NODE level");

console.log(knexConfig.default[env] as any);
const knex = Knex({
  ...(knexConfig.default[env] as any),
  ...knexSnakeCaseMappers({
    underscoreBeforeDigits: true,
  }),
});
Model.knex(knex);

export { knex };
