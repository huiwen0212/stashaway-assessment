import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable("deposits")) return;

  return knex.schema.createTable("deposits", (table) => {
    table.increments("id").unique().primary();
    table.integer("user_id").unsigned().index();
    table.string("deposit_type").notNullable();
    table.decimal("amount", 12, 2).notNullable(); // creates a decimal column with 10 digits of precision and 2 decimal places
    table.string("bank_name").notNullable();
    table.string("bank_card_number").notNullable();
    table.date("deposit_date").notNullable();
    table.string("deposit_status").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.foreign("user_id").references("id").inTable("users");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("deposits");
}
