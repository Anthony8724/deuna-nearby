import { MerchantCard, type MerchantCardProps } from "./merchant-card";
import type { Merchant } from "@/types/merchant";

type MerchantCardListProps = {
  merchants: Merchant[];
  variant?: MerchantCardProps["variant"];
  activeId?: string;
  onSelect?: (merchant: Merchant) => void;
  className?: string;
  listClassName?: string;
  as?: "ul" | "div";
  layout?: "stack" | "grid";
};

export function MerchantCardList({
  merchants,
  variant = "compact",
  activeId,
  onSelect,
  className,
  listClassName,
  as = "ul",
  layout = "stack",
}: MerchantCardListProps) {
  const List = as;
  const Item = as === "ul" ? "li" : "div";
  const isGrid = layout === "grid" && variant !== "compact";

  return (
    <List
      id={variant === "compact" ? "comercios" : undefined}
      className={
        className ??
        (isGrid
          ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          : "flex flex-col gap-3")
      }
    >
      {merchants.map((merchant, index) => (
        <Item key={merchant.id} className={listClassName}>
          <MerchantCard
            merchant={merchant}
            variant={
              variant === "featured" && index === 0 ? "featured" : variant
            }
            active={activeId ? activeId === merchant.id : index === 0}
            onSelect={onSelect}
          />
        </Item>
      ))}
    </List>
  );
}
