import Chart from "@/components/Chart";
import SelectCode from "@/components/SelectCode";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ code: string; interval: string }>;
}) {
  const p = await params;
  return (
    <div>
      <SelectCode code={p.code} />
      <Suspense fallback={<div>Loading...</div>}>
        <Chart code={p.code} interval={p.interval} />
      </Suspense>
    </div>
  );
}
