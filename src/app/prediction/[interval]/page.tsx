import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Prediction from "@/components/Prediction";
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
      <Header code={""} interval={p.interval} />
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
