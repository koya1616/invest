import SelectCode from "@/components/SelectCode";
import SelectInterval from "@/components/SelectInterval";
import ToRevenueButton from "@/components/ToRevenueButton";

export default function Page() {
  return (
    <>
      <p>チャート画面</p>
      <SelectCode code="" />
      <p>予想画面</p>
      <SelectInterval interval="" />
      <ToRevenueButton />
    </>
  );
}
