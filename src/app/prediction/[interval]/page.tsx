import Prediction from "@/components/Prediction";
import ReloadButton from "@/components/ReloadButton";
import SelectInterval from "@/components/SelectInterval";
import ToHomeButton from "@/components/ToHomeButton";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ interval: string }>;
}) {
  const p = await params;
  const codes = ["7203", "8306", "8591", "9432", "9433"];
  return (
    <>
      <ToHomeButton />
      <SelectInterval interval={p.interval} />
      <ReloadButton />

      {codes.map((code) => (
        <Suspense key={code} fallback={<div>Loading...</div>}>
          <Prediction code={code} interval={p.interval} />
        </Suspense>
      ))}
    </>
  );
}
