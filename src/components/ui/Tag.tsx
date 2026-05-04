export default function Tag({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1 rounded-full font-medium text-xs md:text-md transition-all
        ${
          active
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-[#30302E] text-[#aaa] border border-transparent hover:bg-[#333]"
        }
      `}
    >
      {label}
    </button>
  );
}