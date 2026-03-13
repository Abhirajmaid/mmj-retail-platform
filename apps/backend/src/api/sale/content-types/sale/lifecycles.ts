/**
 * Sale lifecycle hooks.
 *
 * afterCreate: When a sale is created with payment_status="paid",
 *   automatically create a LedgerEntry for the customer and
 *   update loyalty points (+1 per ₹1000 spent).
 */
export default {
  async afterCreate(event: any) {
    const { result } = event;
    if (!result) return;

    try {
      const sale = await strapi.entityService.findOne('api::sale.sale', result.id, {
        populate: ['customer'],
      }) as any;

      if (!sale?.customer?.id) return;

      const customerId = sale.customer.id;
      const totalAmount: number = sale.total_amount ?? 0;

      // ── 1. Ledger entry ─────────────────────────────────────────────────
      await strapi.entityService.create('api::ledger-entry.ledger-entry', {
        data: {
          entity_type: 'customer',
          entity_id: customerId,
          debit: totalAmount,
          credit: 0,
          description: `Sale Invoice #${sale.invoice_number ?? result.id}`,
          date: new Date().toISOString().slice(0, 10),
          reference_type: 'sale',
          reference_id: result.id,
        },
      });

      // ── 2. Loyalty points (+1 per ₹1000) ────────────────────────────────
      const pointsEarned = Math.floor(totalAmount / 1000);
      if (pointsEarned > 0) {
        const customer = await strapi.entityService.findOne(
          'api::customer.customer',
          customerId
        ) as any;

        await strapi.entityService.update('api::customer.customer', customerId, {
          data: {
            loyalty_points: (customer?.loyalty_points ?? 0) + pointsEarned,
          },
        });
      }
    } catch (err) {
      strapi.log.error('[sale.afterCreate] Error in lifecycle hook:', err);
    }
  },
};
