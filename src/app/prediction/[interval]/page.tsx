import ReloadButton from "@/components/ReloadButton";
import SelectInterval from "@/components/SelectInterval";

export default async function Page({
  params,
}: {
  params: Promise<{ interval: string }>;
}) {
  const p = await params;
  return (
    <>
      <SelectInterval interval={p.interval} />
      <ReloadButton />
    </>
  );
}
