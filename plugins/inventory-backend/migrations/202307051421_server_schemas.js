// @ts-check

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
    await knex.schema.createTable('t_servers', table => {
      table.comment(
        'The table for servers.',
      );
      table
        .text('id')
        .notNullable()
        .primary()
        .comment('Server ID');
      table
        .string('name')
        .notNullable()
        .comment('Name of the server.');
      table
        .text('operatingSystem')
        .notNullable()
        .comment('Operating System of the server.');
      table
        .text('cpu')
        .notNullable()
        .comment('CPU of the server.');
      table
        .text('tags')
        .notNullable()
        .comment('Tags of the server.');
    });
  };
  
  /**
   * @param {import('knex').Knex} knex
   */
  exports.down = async function down(knex) {
    await knex.schema.dropTable('t_servers');
  };