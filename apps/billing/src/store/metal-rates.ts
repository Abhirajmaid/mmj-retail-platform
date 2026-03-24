"use client";

export interface MetalRate {
  metal: "gold" | "silver";
  ratePerUnit: number;
  unit: string;
  changePercent: number;
  sparkData: number[];
}

const defaultGold: MetalRate = {
  metal: "gold",
  ratePerUnit: 95000,
  unit: "10 gm",
  changePercent: 1.2,
  sparkData: [92, 93, 94, 93.5, 94.2, 95],
};

const defaultSilver: MetalRate = {
  metal: "silver",
  ratePerUnit: 97335,
  unit: "10 gm",
  changePercent: -0.4,
  sparkData: [98, 97.5, 97, 97.2, 96.8, 97.335],
};

export const defaultMetalRates: MetalRate[] = [defaultGold, defaultSilver];
