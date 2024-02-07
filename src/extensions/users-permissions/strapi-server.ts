import { parseMultipartData } from "@strapi/utils";
import * as fs from "fs";

module.exports = (plugin) => {
  const sanitizeOutput = (user) => {
    const {
      password,
      resetPasswordToken,
      confirmationToken,
      ...sanitizedUser
    } = user;
    return sanitizedUser;
  };

  plugin.controllers.user.updateMe = async (ctx) => {
    if (!ctx.state.user || !ctx.state.user.id) {
      return (ctx.response.status = 401);
    }
    try {
      const { data, files } = parseMultipartData(ctx);
      let updatedUserData = {
        username: data.username,
      };
      let user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        ctx.state.user.id,
        { populate: ["avatar"] }
      );
      if (files.avatar) {
        const fileStat = fs.statSync(files.avatar.path);
        await strapi
          .query("plugin::upload.file")
          .delete({ where: { id: user.avatar.id } });
        await strapi.plugins.upload.services.upload.upload({
          data: {
            refId: ctx.state.user.id,
            ref: "plugin::users-permissions.user",
            source: "users-permissions",
            field: "avatar",
          },
          files: {
            path: files.avatar.path,
            name: files.avatar.name,
            type: "image/jpeg",
            size: fileStat.size,
          },
        });
      }
      user = await strapi.entityService.update(
        "plugin::users-permissions.user",
        ctx.state.user.id,
        { populate: ["avatar"], data: updatedUserData }
      );
      ctx.response.status = 200;
      ctx.body = sanitizeOutput(user);
    } catch (error) {
      console.error("Error updating user data:", error);
      ctx.response.status = 500;
    }
  };

  plugin.controllers.user.me = async (ctx) => {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    try {
      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        ctx.state.user.id,
        { populate: ["avatar"] }
      );
      ctx.body = sanitizeOutput(user);
    } catch (error) {
      console.error("Error getting user data:", error);
      ctx.response.status = 500;
    }
  };

  plugin.routes["content-api"].routes.unshift({
    method: "PUT",
    path: "/user/me",
    handler: "user.updateMe",
  });
  return plugin;
};
