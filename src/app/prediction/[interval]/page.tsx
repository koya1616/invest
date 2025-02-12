import ReloadButton from "@/components/ReloadButton";
import SelectInterval from "@/components/SelectInterval";
import ToHomeButton from "@/components/ToHomeButton";

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
    </>
  );
}
