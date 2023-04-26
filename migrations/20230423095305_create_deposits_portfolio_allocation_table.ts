import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable("deposits_portfolio_allocation")) return;

  return knex.schema.createTable("deposits_portfolio_allocation", (table) => {
    table.increments("id").unique().primary();
    table.integer("deposit_id").unsigned().index();
    table.integer("user_id").unsigned().index();
    table.string("portfolio_type").notNullable();
    table.string("amount").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.foreign("deposit_id").references("id").inTable("deposits");
    table.foreign("user_id").references("id").inTable("users");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("deposits_portfolio_allocation");
}
