import SuccessContent from "@/shared/components/SuccessContent";
import { Suspense } from "react";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
