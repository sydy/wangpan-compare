import type { Drive } from "@/data/types";
import { CompareMatrixTabs } from "@/components/compare-matrix-tabs";

interface CompareMatrixProps {
  drives: Drive[];
  diffMode: boolean;
}

/** Server-friendly wrapper: matrix table is RSC; tab UI is a small client island. */
export function CompareMatrix({ drives, diffMode }: CompareMatrixProps) {
  return <CompareMatrixTabs drives={drives} diffMode={diffMode} />;
}
