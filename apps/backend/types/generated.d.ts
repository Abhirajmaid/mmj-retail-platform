/**
 * Auto-generated Strapi types.
 *
 * Run `npm run type-gen` (strapi ts:generate-types) inside apps/backend
 * to regenerate this file after schema changes.
 */

import type { Attribute, Schema } from '@strapi/strapi';

export interface ApiCategoryCategory extends Schema.CollectionType {
  collectionName: 'categories';
  info: {
    singularName: 'category';
    pluralName: 'categories';
    displayName: 'Category';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    slug: Attribute.UID<'api::category.category', 'name'>;
    description: Attribute.Text;
    products: Attribute.Relation<'api::category.category', 'oneToMany', 'api::product.product'>;
  };
}

export interface ApiProductProduct extends Schema.CollectionType {
  collectionName: 'products';
  info: {
    singularName: 'product';
    pluralName: 'products';
    displayName: 'Product';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    slug: Attribute.UID<'api::product.product', 'name'>;
    description: Attribute.RichText;
    price: Attribute.Decimal;
    sku: Attribute.String & Attribute.Unique;
    weight: Attribute.Decimal;
    metal: Attribute.String;
    purity: Attribute.String;
    stock: Attribute.Integer & Attribute.DefaultTo<0>;
    images: Attribute.Media<'images', true>;
    category: Attribute.Relation<'api::product.product', 'manyToOne', 'api::category.category'>;
  };
}

export interface ApiCustomerCustomer extends Schema.CollectionType {
  collectionName: 'customers';
  info: {
    singularName: 'customer';
    pluralName: 'customers';
    displayName: 'Customer';
  };
  attributes: {
    name: Attribute.String;
    email: Attribute.Email;
    phone: Attribute.String;
    address: Attribute.Text;
    orders: Attribute.Relation<'api::customer.customer', 'oneToMany', 'api::order.order'>;
  };
}

export interface ApiOrderOrder extends Schema.CollectionType {
  collectionName: 'orders';
  info: {
    singularName: 'order';
    pluralName: 'orders';
    displayName: 'Order';
  };
  attributes: {
    orderNumber: Attribute.UID;
    status: Attribute.Enumeration<['pending', 'paid', 'shipped', 'delivered', 'cancelled']> &
      Attribute.DefaultTo<'pending'>;
    total: Attribute.Decimal;
    paymentMethod: Attribute.String;
    items: Attribute.JSON;
    customer: Attribute.Relation<'api::order.order', 'manyToOne', 'api::customer.customer'>;
  };
}

export interface ApiInventoryInventory extends Schema.CollectionType {
  collectionName: 'inventories';
  info: {
    singularName: 'inventory';
    pluralName: 'inventories';
    displayName: 'Inventory';
  };
  attributes: {
    product: Attribute.Relation<'api::inventory.inventory', 'oneToOne', 'api::product.product'>;
    quantity: Attribute.Integer & Attribute.DefaultTo<0>;
    location: Attribute.String;
    lastUpdated: Attribute.DateTime;
  };
}

export interface ApiSupplierSupplier extends Schema.CollectionType {
  collectionName: 'suppliers';
  info: {
    singularName: 'supplier';
    pluralName: 'suppliers';
    displayName: 'Supplier';
  };
  attributes: {
    name: Attribute.String;
    email: Attribute.Email;
    phone: Attribute.String;
    address: Attribute.Text;
    products: Attribute.Relation<'api::supplier.supplier', 'manyToMany', 'api::product.product'>;
  };
}

export interface ApiInvoiceInvoice extends Schema.CollectionType {
  collectionName: 'invoices';
  info: {
    singularName: 'invoice';
    pluralName: 'invoices';
    displayName: 'Invoice';
  };
  attributes: {
    invoiceNumber: Attribute.UID;
    customer: Attribute.Relation<'api::invoice.invoice', 'manyToOne', 'api::customer.customer'>;
    order: Attribute.Relation<'api::invoice.invoice', 'oneToOne', 'api::order.order'>;
    total: Attribute.Decimal;
    tax: Attribute.Decimal;
    discount: Attribute.Decimal & Attribute.DefaultTo<0>;
    status: Attribute.Enumeration<['draft', 'paid', 'cancelled']> &
      Attribute.DefaultTo<'draft'>;
  };
}

declare module '@strapi/strapi' {
  export module Shared {
    export interface ContentTypes {
      'api::category.category': ApiCategoryCategory;
      'api::product.product': ApiProductProduct;
      'api::customer.customer': ApiCustomerCustomer;
      'api::order.order': ApiOrderOrder;
      'api::inventory.inventory': ApiInventoryInventory;
      'api::supplier.supplier': ApiSupplierSupplier;
      'api::invoice.invoice': ApiInvoiceInvoice;
    }
  }
}
