/**
 * SaleItem lifecycle hooks.
 *
 * afterCreate: When a sale item is created,
 *   automatically mark the corresponding jewellery item as "sold".
 */
export default {
  async afterCreate(event: any) {
    const { result } = event;
    if (!result) return;

    try {
      const saleItem = await strapi.entityService.findOne('api::sale-item.sale-item', result.id, {
        populate: ['jewellery_item'],
      }) as any;

      const jewelleryItemId = saleItem?.jewellery_item?.id;
      if (!jewelleryItemId) return;

      await strapi.entityService.update('api::jewellery-item.jewellery-item', jewelleryItemId, {
        data: { status: 'sold' },
      });

      strapi.log.info(`[sale-item.afterCreate] Jewellery item #${jewelleryItemId} marked as sold`);
    } catch (err) {
      strapi.log.error('[sale-item.afterCreate] Error in lifecycle hook:', err);
    }
  },
};
