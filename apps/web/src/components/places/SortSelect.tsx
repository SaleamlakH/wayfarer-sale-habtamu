import { Select } from "../ui/Select";

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-(--ink-muted)">
      <label>Sort:</label>
      <Select
        aria-label="Sort places"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="rate">Highest rated</option>
        <option value="default">Default order</option>
      </Select>
    </div>
  );
}
