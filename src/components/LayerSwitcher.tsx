type Props = {
  onChange: (value: "light" | "dark") => void;
};

const LayerSwitcher = ({ onChange }: Props) => {
  return (
    <div className="absolute top-4 left-4 z-50">
      <select
        onChange={(e) =>
          onChange(e.target.value as "light" | "dark")
        }
        className="bg-white/90 border border-gray-200 text-sm rounded-lg shadow-md px-3 py-2 cursor-pointer"
        defaultValue="light"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
};

export default LayerSwitcher;