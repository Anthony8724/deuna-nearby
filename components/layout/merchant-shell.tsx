"use client";

import { MobileMerchantShell } from "./mobile-merchant-shell";

export function MerchantShell({ children }: { children: React.ReactNode }) {
  return <MobileMerchantShell>{children}</MobileMerchantShell>;
}
