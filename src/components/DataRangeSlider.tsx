export const DataRangeSlider = ({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
}) => {
  return (
    <div className="flex items-center gap-4">
      <input
        type="range"
        min={10}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-48 mx-auto"
      />
    </div>
  );
};

export default DataRangeSlider;
