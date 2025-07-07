import { DiscountItem } from "./Item";
import { Discount } from "@/types/discount";

interface DiscountListProps {
  discounts: Discount[];
}

export function DiscountList({ discounts }: DiscountListProps) {
  return (
    <>
      <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
        {discounts.map((discount: Discount) => (
          <DiscountItem item={discount} key={discount.id} />
        ))}
      </div>
    </>
  );
}
