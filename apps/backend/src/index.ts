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

  // Authenticated CRUD permissions — all ERP collections
  const erpCollections = [
    'order', 'customer', 'invoice', 'inventory', 'supplier',
    // New ERP content types
    'store', 'jewellery-item', 'stone', 'stone-inventory',
    'purchase-order', 'purchase-item',
    'sale', 'sale-item', 'payment',
    'custom-order', 'repair',
    'manufacturing-order', 'karigar',
    'expense', 'ledger-entry', 'saving-scheme',
  ];

  const crudActions = ['find', 'findOne', 'create', 'update', 'delete'];

  const authenticatedPermissions = erpCollections.flatMap((col) => {
    const uid = col === 'jewellery-item'
      ? 'api::jewellery-item.jewellery-item'
      : col === 'stone-inventory'
        ? 'api::stone-inventory.stone-inventory'
        : col === 'purchase-order'
          ? 'api::purchase-order.purchase-order'
          : col === 'purchase-item'
            ? 'api::purchase-item.purchase-item'
            : col === 'sale-item'
              ? 'api::sale-item.sale-item'
              : col === 'custom-order'
                ? 'api::custom-order.custom-order'
                : col === 'manufacturing-order'
                  ? 'api::manufacturing-order.manufacturing-order'
                  : col === 'ledger-entry'
                    ? 'api::ledger-entry.ledger-entry'
                    : col === 'saving-scheme'
                      ? 'api::saving-scheme.saving-scheme'
                      : `api::${col}.${col}`;
    return crudActions.map((act) => ({
      action: `${uid}.${act}`,
      roleId: authenticatedRole.id,
    }));
  });

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
