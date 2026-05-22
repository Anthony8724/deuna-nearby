import Link from "next/link";
import type { Merchant } from "@/types/merchant";

export type MerchantCardVariant = "compact" | "default" | "featured";

export type MerchantCardProps = {
  merchant: Merchant;
  variant?: MerchantCardVariant;
  active?: boolean;
  className?: string;
  onSelect?: (merchant: Merchant) => void;
};

function MerchantAvatar({ merchant }: { merchant: Merchant }) {
  if (merchant.imageUrl) {
    return (
      <img
        src={merchant.imageUrl}
        alt=""
        className="h-full w-full rounded-[inherit] object-cover"
      />
    );
  }

  return (
    <span className="text-sm font-semibold text-foreground">
      {merchant.name.charAt(0)}
    </span>
  );
}

function PaymentBadge({ method }: { method: Merchant["accepts"] }) {
  const styles =
    method === "NFC"
      ? "bg-accent-secondary/15 text-accent-secondary"
      : method === "Wallet"
        ? "bg-white/10 text-foreground"
        : "bg-accent/15 text-accent";

  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${styles}`}
    >
      {method}
    </span>
  );
}

function RatingBadge({ rating }: { rating: number }) {
  return (
    <span className="font-mono text-xs font-medium text-accent">
      ★ {rating.toFixed(1)}
    </span>
  );
}

function OpenStatus({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-medium ${
        isOpen ? "text-accent" : "text-muted"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isOpen ? "bg-accent shadow-[0_0_6px_var(--glow)]" : "bg-muted"
        }`}
      />
      {isOpen ? "Abierto" : "Cerrado"}
    </span>
  );
}

function MerchantCardCompact({
  merchant,
  active,
  className,
  onSelect,
}: MerchantCardProps) {
  const Wrapper = onSelect ? "button" : "article";

  return (
    <Wrapper
      type={onSelect ? "button" : undefined}
      onClick={onSelect ? () => onSelect(merchant) : undefined}
      className={`flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-colors hover:bg-white/4 ${
        active ? "bg-white/6 ring-1 ring-accent/20" : ""
      } ${className ?? ""}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-white/10 to-white/5">
        <MerchantAvatar merchant={merchant} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{merchant.name}</p>
        <p className="text-xs text-muted">
          {merchant.category} · {merchant.distance}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <RatingBadge rating={merchant.rating} />
        <PaymentBadge method={merchant.accepts} />
      </div>
    </Wrapper>
  );
}

function MerchantCardDefault({
  merchant,
  active,
  className,
  onSelect,
}: MerchantCardProps) {
  const Wrapper = onSelect ? "button" : "article";

  return (
    <Wrapper
      type={onSelect ? "button" : undefined}
      onClick={onSelect ? () => onSelect(merchant) : undefined}
      className={`glass group flex w-full flex-col rounded-2xl p-4 text-left transition-all hover:border-white/12 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] ${
        active ? "ring-1 ring-accent/25" : ""
      } ${className ?? ""}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-white/10 to-white/5 ring-1 ring-white/8 transition-transform group-hover:scale-105">
            <MerchantAvatar merchant={merchant} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">{merchant.name}</h3>
            <p className="text-xs text-muted">{merchant.category}</p>
          </div>
        </div>
        <RatingBadge rating={merchant.rating} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white/6 px-2.5 py-1 text-xs font-medium text-foreground">
          {merchant.distance}
        </span>
        <PaymentBadge method={merchant.accepts} />
        {merchant.cashback && (
          <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
            Cashback {merchant.cashback}
          </span>
        )}
        {merchant.isOpen !== undefined && (
          <OpenStatus isOpen={merchant.isOpen} />
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/6 pt-3">
        <span className="text-xs text-muted">Pago instantáneo</span>
        <Link
          href={`/comercio/dashboard?merchant=${merchant.id}`}
          className="text-xs font-semibold text-accent transition-colors group-hover:text-foreground"
        >
          Ver dashboard →
        </Link>
      </div>
    </Wrapper>
  );
}

function MerchantCardFeatured({
  merchant,
  className,
  onSelect,
}: MerchantCardProps) {
  return (
    <MerchantCardDefault
      merchant={merchant}
      active
      className={`bg-linear-to-br from-accent-secondary/10 to-accent/5 ${className ?? ""}`}
      onSelect={onSelect}
    />
  );
}

export function MerchantCard({
  merchant,
  variant = "default",
  active = false,
  className,
  onSelect,
}: MerchantCardProps) {
  switch (variant) {
    case "compact":
      return (
        <MerchantCardCompact
          merchant={merchant}
          active={active}
          className={className}
          onSelect={onSelect}
        />
      );
    case "featured":
      return (
        <MerchantCardFeatured
          merchant={merchant}
          className={className}
          onSelect={onSelect}
        />
      );
    default:
      return (
        <MerchantCardDefault
          merchant={merchant}
          active={active}
          className={className}
          onSelect={onSelect}
        />
      );
  }
}
