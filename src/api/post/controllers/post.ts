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
  async findOne(ctx) {
    const { data } = await super.findOne(ctx);

    const query = strapi.db.query('api::post.post');

    const post =  await query.findOne({
      where: {
        id: data.id,
      },
      populate: ['createdBy'],
    });
    data.createdBy = {
      id: post.createdBy.id,
      firstname: post.createdBy.firstname,
      lastname: post.createdBy.lastname,
      email: post.createdBy.email
    };
    
    return { data }   
  } 
}));