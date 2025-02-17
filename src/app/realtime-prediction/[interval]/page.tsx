import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Prediction2 from "@/components/Prediction2";
import { REALTIME_CODE } from "@/const/code";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ interval: string }>;
}) {
  const p = await params;
  return (
    <>
      <Header code={""} interval={p.interval} />
      <div className="flex gap-2 flex-wrap justify-around">
        {REALTIME_CODE.map((item) => (
          <Suspense key={item.code} fallback={<Loading />}>
            <Prediction2 code={item.code} name={item.name} interval={p.interval} />
          </Suspense>
        ))}
      </div>
    </>
  );
}
