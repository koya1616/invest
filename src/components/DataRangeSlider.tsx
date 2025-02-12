const DataRangeSlider = ({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
}) => {
  return (
    <div className="flex items-center gap-4 justify-center">
      <button
        type="button"
        onClick={() => onChange(value - 10)}
        className="w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer"
        disabled={value <= 10}
      >
        -
      </button>
      <input
        type="range"
        min={10}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-48"
      />
      <button
        type="button"
        onClick={() => onChange(value + 10)}
        className="w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
};

export default DataRangeSlider;
