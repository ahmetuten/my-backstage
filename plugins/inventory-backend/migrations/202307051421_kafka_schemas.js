// @ts-check

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
    await knex.schema.createTable('t_kafkas', table => {
      table.comment(
        'The table for kafkas.',
      );
      table
        .text('id')
        .notNullable()
        .primary()
        .comment('Kafka ID');
      table
        .string('name')
        .notNullable()
        .comment('Name of the server.');
      table
        .text('zookeeperNodes')
        .notNullable()
        .comment('Zookeeper Nodes of the server.');
      table
        .text('brokers')
        .notNullable()
        .comment('Brokers of the server.');
      table
        .text('version')
        .notNullable()
        .comment('Version of the server.');
      table
        .text('adminUrl')
        .notNullable()
        .comment('Admin User of the server.');
      table
        .text('adminUser')
        .notNullable()
        .comment('Admin User of the server.');
      table
        .text('adminPassword')
        .notNullable()
        .comment('Admin Password of the server.');
    });
  };
  
  /**
   * @param {import('knex').Knex} knex
   */
  exports.down = async function down(knex) {
    await knex.schema.dropTable('t_kafkas');
  };