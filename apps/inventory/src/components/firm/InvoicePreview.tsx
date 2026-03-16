"use client";

interface InvoicePreviewImages {
  formLeftImage?: string;
  formRightLogo?: string;
  formRightImage?: string;
  ownerSignature?: string;
  qrCodeImage?: string;
}

interface InvoicePreviewProps {
  images: InvoicePreviewImages;
}

function PreviewImage({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded border border-dashed border-zinc-200 bg-zinc-50 text-xs text-zinc-400 ${className}`}
      >
        {alt}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`object-contain ${className}`}
    />
  );
}

export function InvoicePreview({ images }: InvoicePreviewProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-inner">
      {/* Bill header: left image | centre title | right logo */}
      <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
        <div className="w-24 shrink-0">
          <PreviewImage
            src={images.formLeftImage}
            alt="Form left image"
            className="h-20 w-20 rounded"
          />
        </div>
        <div className="min-w-0 flex-1 text-center">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Preview</p>
          <h3 className="mt-1 text-lg font-semibold text-zinc-900">Invoice / Bill</h3>
          <p className="mt-0.5 text-sm text-zinc-500">Company Name</p>
        </div>
        <div className="w-24 shrink-0">
          <PreviewImage
            src={images.formRightLogo}
            alt="Logo"
            className="h-20 w-20 rounded"
          />
        </div>
      </div>

      {/* Invoice meta */}
      <div className="mt-4 flex justify-between text-sm text-zinc-600">
        <span>Invoice #: ---</span>
        <span>Date: ---</span>
      </div>

      {/* Sample table */}
      <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50">
              <th className="border-b border-zinc-200 px-3 py-2 text-left font-medium text-zinc-700">Item</th>
              <th className="border-b border-zinc-200 px-3 py-2 text-right font-medium text-zinc-700">Qty</th>
              <th className="border-b border-zinc-200 px-3 py-2 text-right font-medium text-zinc-700">Rate</th>
              <th className="border-b border-zinc-200 px-3 py-2 text-right font-medium text-zinc-700">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-zinc-100 px-3 py-2 text-zinc-600">Sample item</td>
              <td className="border-b border-zinc-100 px-3 py-2 text-right text-zinc-600">1</td>
              <td className="border-b border-zinc-100 px-3 py-2 text-right text-zinc-600">—</td>
              <td className="border-b border-zinc-100 px-3 py-2 text-right text-zinc-600">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer: right image, signature, QR */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-zinc-200 pt-4">
        <div className="w-28 shrink-0">
          <PreviewImage
            src={images.formRightImage}
            alt="Form right image"
            className="h-24 w-full rounded"
          />
        </div>
        <div className="flex items-end gap-6">
          <div className="text-center">
            <PreviewImage
              src={images.ownerSignature}
              alt="Signature"
              className="mx-auto h-14 w-24 rounded border-0"
            />
            <p className="mt-1 text-xs text-zinc-500">Authorised Signature</p>
          </div>
          <div className="text-center">
            <PreviewImage
              src={images.qrCodeImage}
              alt="QR Code"
              className="mx-auto h-20 w-20 rounded"
            />
            <p className="mt-1 text-xs text-zinc-500">QR Code</p>
          </div>
        </div>
      </div>
    </div>
  );
}
