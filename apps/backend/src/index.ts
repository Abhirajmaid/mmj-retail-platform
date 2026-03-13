import type { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    // Register custom services, middlewares, or policies here
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Bootstrap logic: set default permissions for public/authenticated roles
    await setDefaultPermissions(strapi);
  },
};

async function setDefaultPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  const authenticatedRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'authenticated' } });

  if (!publicRole || !authenticatedRole) return;

  // Public read-only permissions for products and categories
  const publicPermissions = [
    { action: 'api::product.product.find', roleId: publicRole.id },
    { action: 'api::product.product.findOne', roleId: publicRole.id },
    { action: 'api::category.category.find', roleId: publicRole.id },
    { action: 'api::category.category.findOne', roleId: publicRole.id },
  ];

  // Authenticated CRUD permissions
  const authenticatedPermissions = [
    { action: 'api::order.order.find', roleId: authenticatedRole.id },
    { action: 'api::order.order.findOne', roleId: authenticatedRole.id },
    { action: 'api::order.order.create', roleId: authenticatedRole.id },
    { action: 'api::order.order.update', roleId: authenticatedRole.id },
    { action: 'api::order.order.delete', roleId: authenticatedRole.id },
    { action: 'api::customer.customer.find', roleId: authenticatedRole.id },
    { action: 'api::customer.customer.findOne', roleId: authenticatedRole.id },
    { action: 'api::customer.customer.create', roleId: authenticatedRole.id },
    { action: 'api::customer.customer.update', roleId: authenticatedRole.id },
    { action: 'api::customer.customer.delete', roleId: authenticatedRole.id },
    { action: 'api::invoice.invoice.find', roleId: authenticatedRole.id },
    { action: 'api::invoice.invoice.findOne', roleId: authenticatedRole.id },
    { action: 'api::invoice.invoice.create', roleId: authenticatedRole.id },
    { action: 'api::invoice.invoice.update', roleId: authenticatedRole.id },
    { action: 'api::invoice.invoice.delete', roleId: authenticatedRole.id },
    { action: 'api::inventory.inventory.find', roleId: authenticatedRole.id },
    { action: 'api::inventory.inventory.findOne', roleId: authenticatedRole.id },
    { action: 'api::inventory.inventory.create', roleId: authenticatedRole.id },
    { action: 'api::inventory.inventory.update', roleId: authenticatedRole.id },
    { action: 'api::inventory.inventory.delete', roleId: authenticatedRole.id },
  ];

  const allPermissions = [...publicPermissions, ...authenticatedPermissions];

  for (const { action, roleId } of allPermissions) {
    const existing = await strapi
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: roleId } });

    if (!existing) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: { action, role: roleId, enabled: true },
      });
    } else if (!existing.enabled) {
      await strapi
        .query('plugin::users-permissions.permission')
        .update({ where: { id: existing.id }, data: { enabled: true } });
    }
  }
}
