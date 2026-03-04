import { useState } from "react";

export default function SelectorChart({ onSelect }: { onSelect: (year: number) => void }) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    onSelect(year);
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <button 
        onClick={() => handleYearChange(selectedYear - 1)}
        className="px-3 py-1 border rounded"
      >
        ←
      </button>
      <span className="text-xl font-semibold">{selectedYear}</span>
      <button
        onClick={() => handleYearChange(selectedYear + 1)}
        className="px-3 py-1 border rounded"
      >
        →
      </button>
    </div>
  );
};