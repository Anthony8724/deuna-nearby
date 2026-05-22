"use client";

type MobileMerchantShellProps = {
  children: React.ReactNode;
};

export function MobileMerchantShell({ children }: MobileMerchantShellProps) {
  return (
    <div className="flex min-h-dvh items-start justify-center bg-[#1A1A1A] px-3 py-4 sm:py-6">
      <div className="relative flex w-full max-w-[400px] min-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-[32px] bg-[#F8F9FA] shadow-[0_24px_80px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.06)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center pt-2">
          <span className="h-1 w-28 rounded-full bg-black/10" aria-hidden />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
