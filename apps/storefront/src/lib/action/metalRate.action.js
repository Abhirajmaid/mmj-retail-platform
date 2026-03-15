import { initialMetalRates } from "@/src/data/metalRates";

let metalRates = initialMetalRates.map((rate) => ({ ...rate }));

const updateMetalRate = async (id, value) => {
  metalRates = metalRates.map((rate) =>
    rate.id === id
      ? {
          ...rate,
          attributes: {
            ...rate.attributes,
            rate: Number(value),
            updatedAt: new Date().toISOString(),
          },
        }
      : rate
  );

  const updated = metalRates.find((rate) => rate.id === id);
  return { data: { data: updated } };
};

const getMetalRates = async () => ({ data: { data: metalRates } });


export default {
  updateMetalRate,
  getMetalRates,
};