import Loading from "@/components/Loading";
import Prediction from "@/components/Prediction";
import ReloadButton from "@/components/ReloadButton";
import SelectNewInterval from "@/components/SelectNewInterval";
import ToHomeButton from "@/components/ToHomeButton";
import { CODE } from "@/const/code";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ interval: string }>;
}) {
  const p = await params;
  return (
    <>
      <ToHomeButton />
      <SelectNewInterval interval={p.interval} />
      <ReloadButton />
      <div className="flex gap-2 flex-wrap justify-around">
        {CODE.map((item) => (
          <Suspense key={item.code} fallback={<Loading />}>
            <Prediction code={item.code} name={item.name} interval={p.interval} />
          </Suspense>
        ))}
      </div>
    </>
  );
}
