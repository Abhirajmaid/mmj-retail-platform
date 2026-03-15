"use client";

export default function GoldRateBar({ rates = {} }) {
  const defaults = {
    "24KT": 6420,
    "22KT": 5885,
    "18KT": 4815,
    Silver: 82,
    ...rates,
  };

  return (
    <div className="bg-[hsl(223,84%,25%)] text-white px-4 py-2 flex items-center gap-6 text-xs">
      <span className="font-semibold text-white/60 uppercase tracking-wide">Live Rates</span>
      {Object.entries(defaults).map(([metal, rate]) => (
        <span key={metal} className="flex items-center gap-1.5">
          <span className="text-white/60">{metal}</span>
          <span className="font-bold text-[#E9B120]">₹{rate.toLocaleString("en-IN")}/g</span>
        </span>
      ))}
    </div>
  );
}
