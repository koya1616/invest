import Chart from "@/components/Chart";
import ReloadButton from "@/components/ReloadButton";
import SelectCode from "@/components/SelectCode";
import SelectInterval from "@/components/SelectInterval";
import ToHomeButton from "@/components/ToHomeButton";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ code: string; interval: string }>;
}) {
  const p = await params;
  return (
    <>
      <ToHomeButton />
      <SelectCode code={p.code} />
      <SelectInterval code={p.code} interval={p.interval} />
      <ReloadButton />
      <Suspense fallback={<div>Loading...</div>}>
        <Chart code={p.code} interval={p.interval} />
      </Suspense>
    </>
  );
}
