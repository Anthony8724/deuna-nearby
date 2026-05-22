import { MerchantShell } from "@/components/layout/merchant-shell";

export default function ComercioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MerchantShell>{children}</MerchantShell>;
}
