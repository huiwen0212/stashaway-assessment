import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable("users")) return;

  return knex.schema.createTable("users", (table) => {
    table.increments("id").unique().primary();
    table.string("name").notNullable();
    table.string("email").unique().notNullable();
    table.string("reference_code").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("users");
}
