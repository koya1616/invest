import Prediction from "@/components/Prediction";
import ReloadButton from "@/components/ReloadButton";
import SelectInterval from "@/components/SelectInterval";
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
      <SelectInterval interval={p.interval} />
      <ReloadButton />

      {CODE.map((item) => (
        <Suspense key={item.code} fallback={<div>Loading...</div>}>
          <Prediction code={item.code} interval={p.interval} />
        </Suspense>
      ))}
    </>
  );
}
