import { createCoreController } from '@strapi/strapi/lib/factories';

/**
 * item controller
 */

module.exports = createCoreController('api::category.category', ({ strapi }) => ({
  async findOne(ctx) {
    const { data } = await super.findOne(ctx);

    const query = strapi.db.query('api::category.category');
    const queryPost = strapi.db.query('api::post.post');

    const category =  await query.findOne({
      where: {
        id: data.id,
      },
      populate: ['posts'],
    });
    data['posts'] = category.posts
    await Promise.all(
      category.posts.map(async(item, index)=> {
        const post = await queryPost.findOne({
          where: {
            id: item.id,
          },
          populate: ['categories', 'image', 'createdBy'],
        });
        data.posts[index] = post
      })
    )
    return { data }   
  } 
}));