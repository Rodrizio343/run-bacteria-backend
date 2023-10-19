'use strict';

/**
 *  article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({ strapi }) => ({
  async find(ctx) {
    // Calling the default core action
    const { data, meta } = await super.find(ctx);

    const query = strapi.db.query('api::post.post');

    await Promise.all(
      data.map(async (item, index) => {
        const post = await query.findOne({
          where: {
            id: item.id,
          },
          populate: ['createdBy'],
        });
        console.log(post)
        data[index].createdBy = {
          id: post.createdBy.id,
          firstname: post.createdBy.firstname,
          lastname: post.createdBy.lastname,
          email: post.createdBy.email
        };
      })
    );

    return { data, meta };
  },
}));