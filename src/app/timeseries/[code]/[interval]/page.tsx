import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Prediction from "@/components/Prediction";
import Revenue from "@/components/Revenue";
import Timeseries from "@/components/Timeseries";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ code: string; interval: string }>;
}) {
  const p = await params;
  return (
    <>
      <Header code={p.code} interval={p.interval} />
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
