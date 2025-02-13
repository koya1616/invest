import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Revenue from "@/components/Revenue";
import { CODE } from "@/const/code";
import { Suspense } from "react";

export default async function Page() {
  return (
    <>
      <Header code={""} interval={""} />
      <div className="flex gap-2 flex-wrap justify-around">
        {CODE.map((item) => (
          <Suspense key={item.code} fallback={<Loading />}>
            <Revenue code={String(item.code)} name={item.name} />
          </Suspense>
        ))}
      </div>
    </>
  );
}
