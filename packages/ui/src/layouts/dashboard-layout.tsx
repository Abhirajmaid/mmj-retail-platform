"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import type { SidebarItem } from "../components/sidebar";
import { Navbar } from "../components/navbar";
import { Sidebar } from "../components/sidebar";

interface DashboardLayoutProps {
  brand: {
    title: string;
    subtitle: string;
  };
  navigation: SidebarItem[];
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: any;
}

export function DashboardLayout({
  brand,
  navigation,
  title,
  subtitle,
  actions,
  children,
}: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar
        brand={brand}
        items={navigation}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div className="bg-white lg:pl-[268px]">
        <Navbar
          brand={brand}
          title={title}
          subtitle={subtitle}
          actions={actions}
          searchPlaceholder="Search invoices, products, customers"
          onMenuClick={() => setIsOpen(true)}
        />
        <main className="bg-white px-4 py-6 sm:px-6 lg:px-8 lg:pb-10">{children}</main>
      </div>
    </div>
  );
}
