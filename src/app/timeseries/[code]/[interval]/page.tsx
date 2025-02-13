import Loading from "@/components/Loading";
import Prediction from "@/components/Prediction";
import ReloadButton from "@/components/ReloadButton";
import Revenue from "@/components/Revenue";
import SelectCode from "@/components/SelectCode";
import SelectInterval from "@/components/SelectInterval";
import Timeseries from "@/components/Timeseries";
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
      <div className="flex flex-wrap justify-around">
        <Suspense fallback={<Loading />}>
          <Revenue code={p.code} name={""} />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <Prediction code={p.code} name={""} interval={p.interval} />
        </Suspense>
      </div>
      <Suspense fallback={<Loading />}>
        <Timeseries code={p.code} interval={p.interval} />
      </Suspense>
    </>
  );
}
