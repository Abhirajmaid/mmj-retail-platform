import { NextResponse } from "next/server";
import type { Firm } from "@/src/types/firm";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") ?? "";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN ?? "";

function mapStrapiToFirm(entry: { id: number; attributes?: Record<string, unknown> }): Firm {
  const attrs = entry.attributes ?? {};
  return {
    id: String(entry.id),
    firmId: (attrs.firmId as string) ?? "",
    registrationNo: (attrs.registrationNo as string) ?? "",
    shopName: (attrs.shopName as string) ?? "",
    firmType: (attrs.firmType as Firm["firmType"]) ?? "SELF",
    status: (attrs.status as Firm["status"]) ?? "active",
    createdAt: (attrs.createdAt as string) ?? new Date().toISOString(),
    updatedAt: (attrs.updatedAt as string) ?? new Date().toISOString(),
    ...(attrs.firmDescription != null && { firmDescription: attrs.firmDescription as string }),
    ...(attrs.address != null && { address: attrs.address as string }),
    ...(attrs.city != null && { city: attrs.city as string }),
    ...(attrs.pincode != null && { pincode: attrs.pincode as string }),
    ...(attrs.phone != null && { phone: attrs.phone as string }),
    ...(attrs.email != null && { email: attrs.email as string }),
    ...(attrs.website != null && { website: attrs.website as string }),
    ...(attrs.myFirms != null && { myFirms: attrs.myFirms as string }),
    ...(attrs.commentsOtherInfo != null && { commentsOtherInfo: attrs.commentsOtherInfo as string }),
    ...(attrs.paymentBankDetails != null && { paymentBankDetails: attrs.paymentBankDetails as string }),
    ...(attrs.paymentBankAcNo != null && { paymentBankAcNo: attrs.paymentBankAcNo as string }),
    ...(attrs.paymentBankIfsc != null && { paymentBankIfsc: attrs.paymentBankIfsc as string }),
    ...(attrs.paymentDeclaration != null && { paymentDeclaration: attrs.paymentDeclaration as string }),
    ...(attrs.financialYearStart != null && { financialYearStart: attrs.financialYearStart as string }),
    ...(attrs.cashBalance != null && { cashBalance: Number(attrs.cashBalance) }),
    ...(attrs.cashBalanceCr != null && { cashBalanceCr: Boolean(attrs.cashBalanceCr) }),
    ...(attrs.gstinNo != null && { gstinNo: attrs.gstinNo as string }),
    ...(attrs.panNumber != null && { panNumber: attrs.panNumber as string }),
    ...(attrs.principalAmtFrom != null && { principalAmtFrom: Number(attrs.principalAmtFrom) }),
    ...(attrs.principalAmtTo != null && { principalAmtTo: Number(attrs.principalAmtTo) }),
    ...(attrs.formHeader != null && { formHeader: attrs.formHeader as string }),
    ...(attrs.formFooter != null && { formFooter: attrs.formFooter as string }),
    ...(attrs.principalStartAmount != null && { principalStartAmount: Number(attrs.principalStartAmount) }),
    ...(attrs.principalEndAmount != null && { principalEndAmount: Number(attrs.principalEndAmount) }),
    ...(attrs.formLeftImage != null && { formLeftImage: attrs.formLeftImage as string }),
    ...(attrs.formRightLogo != null && { formRightLogo: attrs.formRightLogo as string }),
    ...(attrs.formRightImage != null && { formRightImage: attrs.formRightImage as string }),
    ...(attrs.ownerSignature != null && { ownerSignature: attrs.ownerSignature as string }),
    ...(attrs.qrCodeImage != null && { qrCodeImage: attrs.qrCodeImage as string }),
  };
}

function toStrapiData(data: Partial<Firm>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const skip = new Set(["id", "createdAt", "updatedAt"]);
  for (const [k, v] of Object.entries(data)) {
    if (skip.has(k) || v === undefined) continue;
    out[k] = v;
  }
  return out;
}

export async function GET() {
  if (!STRAPI_URL) {
    return NextResponse.json({ data: [] });
  }
  try {
    const res = await fetch(`${STRAPI_URL}/api/firms?sort=createdAt:desc`, {
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Strapi request failed", detail: text },
        { status: res.status }
      );
    }
    const json = (await res.json()) as { data?: Array<{ id: number; attributes?: Record<string, unknown> }> };
    const list = Array.isArray(json.data) ? json.data : [];
    const firms = list.map(mapStrapiToFirm);
    return NextResponse.json({ data: firms });
  } catch (e) {
    console.error("[GET /api/firms]", e);
    return NextResponse.json(
      { error: "Failed to fetch firms" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!STRAPI_URL) {
    return NextResponse.json(
      {
        error: "Backend not configured. Set NEXT_PUBLIC_STRAPI_URL in .env.local and ensure Strapi is running.",
      },
      { status: 503 }
    );
  }
  try {
    const body = (await request.json()) as Partial<Firm>;
    const res = await fetch(`${STRAPI_URL}/api/firms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      body: JSON.stringify({ data: toStrapiData(body) }),
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Strapi create failed", detail: text },
        { status: res.status }
      );
    }
    const json = (await res.json()) as { data?: { id: number; attributes?: Record<string, unknown> } };
    const firm = json.data ? mapStrapiToFirm(json.data) : null;
    if (!firm) return NextResponse.json({ error: "No data returned" }, { status: 500 });
    return NextResponse.json({ data: firm });
  } catch (e) {
    console.error("[POST /api/firms]", e);
    return NextResponse.json(
      { error: "Failed to create firm" },
      { status: 500 }
    );
  }
}
