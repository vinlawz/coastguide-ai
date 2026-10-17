// Lightweight cross-component signal so selecting a destination can jump straight into trip planning.
import type { DestinationCategory } from "@/lib/types";

export const PLAN_WITH_CATEGORY_EVENT = "coastguide:plan-with-category";

export function requestPlanForCategory(category: DestinationCategory) {
  window.dispatchEvent(new CustomEvent<DestinationCategory>(PLAN_WITH_CATEGORY_EVENT, { detail: category }));
}
