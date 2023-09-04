// // @ts-check

// /**
//  * @param {import('knex').Knex} knex
//  */
// exports.up = async function up(knex) {
//     await knex.schema.createTable('t_kafkas', table => {
//     table.comment(
//         'The table for kafkas.',
//     );
//     table
//         .text('id')
//         .notNullable()
//         .primary()
//         .comment('Kafka ID');
//     table
//         .string('name')
//         .notNullable()
//         .comment('Name of the server.');
//     table
//         .text('ip')
//         .notNullable()
//         .comment('IP of the server.');
//     table
//         .text('port')
//         .notNullable()
//         .comment('Port of the server.');
//     });
// };

// /**
//    * @param {import('knex').Knex} knex
//    */
// exports.down = async function down(knex) {
//     await knex.schema.dropTable('t_kafkas');
// };