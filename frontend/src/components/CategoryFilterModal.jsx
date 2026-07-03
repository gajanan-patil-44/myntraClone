import { useMemo, useRef, useState } from "react";import { IoClose } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
const CategoryFilterModal = ({
  open,
  onClose,
  categoryCounts,
  selectedSubCategories,
  handleSubCategoryChange,
}) => {
  if (!open) return null;
  const [search, setSearch] = useState("");
  const letterRefs = useRef({});
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const brands = useMemo(() => {
    return Object.entries(categoryCounts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .filter(([brand]) => brand.toLowerCase().includes(search.toLowerCase()));
  }, [categoryCounts, search]);


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
      <div className="bg-white w-[700px] h-[600px] rounded shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold">Select Category</h2>

          <button onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>

        {/* Search (UI only for now) */}
        <div className="p-4 border-b">
          <div className="flex items-center border rounded-md px-3">
            <FiSearch className="text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Category"
              className="flex-1 px-3 py-2 outline-none"
            />
          </div>
        </div>

        {/* Brand List */}
        <div className="border-b overflow-x-auto whitespace-nowrap px-4 py-3 scrollbar-thin">
          <div className="inline-flex gap-4 text-sm font-medium text-[#696b79]">
            {alphabets.map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => {
  letterRefs.current[letter]?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}}
                className="hover:text-[#ff3f6c] shrink-0"
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto px-5 py-4">
  <div
    className="grid gap-x-10"
    style={{
      gridAutoFlow: "column",
      gridTemplateRows: "repeat(14, auto)",
      gridAutoColumns: "240px",
      width: "max-content",
    }}
  >
    {brands.map(([brand, count], index) => {
  const currentLetter = brand[0].toUpperCase();

  const previousLetter =
    index === 0
      ? ""
      : brands[index - 1][0][0].toUpperCase();

  return (
      <label
  key={brand}
  ref={
    previousLetter !== currentLetter
      ? (el) => (letterRefs.current[currentLetter] = el)
      : null
  }
  className="flex items-center gap-3 py-2 cursor-pointer text-sm whitespace-nowrap"
>
        <input
          type="checkbox"
          checked={selectedSubCategories.includes(brand)}
          onChange={() => handleSubCategoryChange(brand)}
        />

        <span className="flex-1">
          {brand}
        </span>

        <span className="text-gray-400 text-xs">
          ({count})
        </span>
      </label>
);
})}
  </div>
</div>
      </div>
    </div>
  );
};

export default CategoryFilterModal;
