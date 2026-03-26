"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, Home, FileText, Wallet, CreditCard } from "lucide-react";

import type { Customer } from "@jewellery-retail/types";
import { useCustomers } from "@jewellery-retail/hooks";
import { Button, Card } from "@jewellery-retail/ui";

const rightActions = [
  { label: "HOME", href: "/dashboard", icon: Home },
  { label: "SELL", href: "/bills/new", icon: FileText },
  { label: "LOAN", href: "/dashboard", icon: Wallet },
  { label: "UDHAAR", href: "/dashboard", icon: CreditCard },
];

const inputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none w-full min-h-[44px]";
const selectClass = `${inputClass} w-full appearance-none bg-white pr-10`;
const selectChevronClass =
  "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400";

export function CustomerSearchBar() {
  const { data: customers } = useCustomers();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState<"Mr" | "Mrs">("Mr");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [si, setSi] = useState("");

  const hasCustomerSearchInput =
    firstName.trim() !== "" ||
    lastName.trim() !== "" ||
    mobile.trim() !== "" ||
    email.trim() !== "" ||
    aadhaar.trim() !== "" ||
    address.trim() !== "" ||
    pincode.trim() !== "" ||
    city.trim() !== "" ||
    state.trim() !== "" ||
    si.trim() !== "";

  const customerSearchTerms = useMemo(
    () =>
      [firstName, lastName, mobile, email, aadhaar, address, city, state].filter((s) => s.trim() !== ""),
    [firstName, lastName, mobile, email, aadhaar, address, city, state]
  );

  const matchingCustomers = useMemo(() => {
    if (!hasCustomerSearchInput || customerSearchTerms.length === 0) return [];
    const lower = customerSearchTerms.map((t) => t.toLowerCase());
    return customers.filter((c) => {
      const searchable = `${c.name} ${c.phone} ${c.email} ${c.city} ${c.address ?? ""}`.toLowerCase();
      return lower.some((term) => searchable.includes(term));
    });
  }, [customers, hasCustomerSearchInput, customerSearchTerms]);

  const showCustomerResults = hasCustomerSearchInput;
  const showCustomerNoResults = showCustomerResults && matchingCustomers.length === 0;

  return (
    <div className="space-y-2">
      <Card className="p-4 md:p-5" padding="none">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 xl:gap-4">
            <div className="col-span-full grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 md:grid-cols-5">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900" htmlFor="first-name">First name</label>
                <input id="first-name" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900" htmlFor="last-name">Last name</label>
                <input id="last-name" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
              </div>
              <div className="relative min-w-0">
                <label className="mb-1 block text-xs font-medium text-zinc-900" htmlFor="title-select">Title</label>
                <select id="title-select" value={title} onChange={(e) => setTitle(e.target.value as "Mr" | "Mrs")} className={selectClass}>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                </select>
                <ChevronDown className={selectChevronClass} aria-hidden />
              </div>
              <div className="relative min-w-0">
                <label className="mb-1 block text-xs font-medium text-zinc-900" htmlFor="gender-select">Gender</label>
                <select id="gender-select" value={gender} onChange={(e) => setGender(e.target.value as "Male" | "Female")} className={selectClass}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <ChevronDown className={selectChevronClass} aria-hidden />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900" htmlFor="mobile-number">Mobile number</label>
                <input id="mobile-number" placeholder="Mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900" htmlFor="email-id">Email ID</label>
                <input id="email-id" placeholder="Email ID" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900" htmlFor="aadhaar-number">Aadhaar number</label>
                <input id="aadhaar-number" placeholder="Aadhaar number" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900" htmlFor="address">Address</label>
                <input id="address" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900" htmlFor="pincode">Pincode</label>
                <input id="pincode" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900" htmlFor="city-village">City / Village</label>
                <input id="city-village" placeholder="City / Village" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900" htmlFor="state">State</label>
                <input id="state" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900" htmlFor="si">SI</label>
                <input id="si" placeholder="SI" value={si} onChange={(e) => setSi(e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-zinc-100 pt-4 lg:border-l lg:border-t-0 lg:pt-0 lg:pl-4">
            {rightActions.map((action) => (
              <Button
                key={action.label}
                variant="primary"
                className="min-h-[52px] rounded-xl px-6 text-base font-semibold tracking-wide shadow-sm"
                asChild
              >
                <Link href={action.href}>
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {hasCustomerSearchInput ? (
        <p className="text-xs text-zinc-500">
          Search by mobile number to find an existing customer or fill details to create a new one.
        </p>
      ) : null}

      {showCustomerResults && (
        <Card className="overflow-hidden p-0" padding="none">
          {matchingCustomers.length > 0 ? (
            <ul className="max-h-[280px] overflow-auto">
              {matchingCustomers.map((c) => (
                <CustomerRow key={c.id} customer={c} />
              ))}
            </ul>
          ) : showCustomerNoResults ? (
            <div className="flex flex-col gap-4 p-6">
              <p className="text-sm font-medium text-zinc-700">No customer found</p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="min-h-[44px] rounded-xl border-zinc-300 px-6 text-zinc-900 hover:bg-zinc-50 hover:text-zinc-900"
                  asChild
                >
                  <Link href="/customers/new">Create New Customer</Link>
                </Button>
                <Button className="min-h-[44px] bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-500" asChild>
                  <Link href="/bills/new">Create New Bill</Link>
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
      )}
    </div>
  );
}

function CustomerRow({ customer }: { customer: Customer }) {
  return (
    <li>
      <Link
        href={`/customers/${customer.id}`}
        className="flex min-h-[44px] items-center justify-between gap-4 border-b border-zinc-100 px-4 py-3 transition-colors hover:bg-zinc-50 last:border-b-0"
      >
        <span className="font-medium text-zinc-950">{customer.name}</span>
        <span className="text-sm text-zinc-500">{customer.phone}</span>
        <span className="text-sm text-zinc-500">{customer.city}</span>
      </Link>
    </li>
  );
}
