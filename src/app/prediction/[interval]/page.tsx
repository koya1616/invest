import SelectInterval from "@/components/SelectInterval";

export default async function Page({
  params,
}: {
  params: Promise<{ interval: string }>;
}) {
  const p = await params;
  return (
    <div>
      <SelectInterval interval={p.interval} />
    </div>
  );
}
