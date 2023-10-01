import { faker } from '@faker-js/faker'

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
//   async bootstrap({ strapi }) {
//     for (let i = 0; i < 20; i++) {
//       await strapi.entityService.create("api::post.post", {
//         data: {
//           title: faker.word.noun() + ' ' + faker.word.adjective(),
//           brief: faker.lorem.paragraph(),
//           content: faker.lorem.paragraphs(5),
//           active: true,
//           category: 'News'
//         }
//       })
//     }
//   },
// };

  bootstrap(/*{ strapi }*/) {}

};