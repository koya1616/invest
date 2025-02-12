import Chart from "@/components/Chart";
import Loading from "@/components/Loading";
import ReloadButton from "@/components/ReloadButton";
import SelectCode from "@/components/SelectCode";
import SelectInterval from "@/components/SelectInterval";
import SelectNewInterval from "@/components/SelectNewInterval";
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
      <SelectNewInterval code={p.code} interval={p.interval} />
      <ReloadButton />
      <Suspense fallback={<Loading />}>
        <Chart code={p.code} interval={p.interval} />
      </Suspense>
    </>
  );
}
