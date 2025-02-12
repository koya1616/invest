import SelectCode from "@/components/SelectCode";
import SelectNewInterval from "@/components/SelectNewInterval";

export default function Page() {
  return (
    <>
      <p>チャート画面</p>
      <SelectCode code="" />
      <p>予想画面</p>
      <SelectNewInterval interval="" />
    </>
  );
}
