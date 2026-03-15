export type FirmType = "SELF" | "PARTNER" | "BRANCH";
export type FirmStatus = "active" | "pending_review" | "inactive";

export interface Firm {
  id: string;
  firmId: string;
  registrationNo: string;
  shopName: string;
  firmDescription?: string;
  address?: string;
  city?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  website?: string;
  myFirms?: string;
  firmType: FirmType;
  commentsOtherInfo?: string;
  geoLat?: string;
  geoLng?: string;
  whatsappLink?: string;
  facebookLink?: string;
  instagramLink?: string;
  smtpServer?: string;
  smtpPort?: string;
  smtpEmailId?: string;
  smtpEmailPassword?: string;
  smtpCcEmailId?: string;
  eInvoiceApiId?: string;
  eInvoiceApiKey?: string;
  eInvoiceUsername?: string;
  eInvoicePassword?: string;
  paymentBankDetails?: string;
  paymentBankAcNo?: string;
  paymentBankIfsc?: string;
  paymentDeclaration?: string;
  financialYearStart?: string;
  cashBalance?: number;
  cashBalanceCr?: boolean;
  gstinNo?: string;
  panNumber?: string;
  principalAmtFrom?: number;
  principalAmtTo?: number;
  formHeader?: string;
  formFooter?: string;
  principalStartAmount?: number;
  principalEndAmount?: number;
  formLeftImage?: string;
  formRightLogo?: string;
  formRightImage?: string;
  ownerSignature?: string;
  qrCodeImage?: string;
  status: FirmStatus;
  createdAt: string;
  updatedAt: string;
}

export const FIRM_TYPE_OPTIONS: { value: FirmType; label: string }[] = [
  { value: "SELF", label: "Self" },
  { value: "PARTNER", label: "Partner" },
  { value: "BRANCH", label: "Branch" },
];

export const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];
