type Props = {
  checked: boolean;
  onChange: () => void;
};

export default function CustomCheckbox({
  checked,
  onChange,
}: Props) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`
        flex h-6 w-6 items-center justify-center rounded-md border transition
        ${
          checked
            ? "border-[#139C73] bg-[#139C73]"
            : "border-[#575757] bg-transparent hover:border-[#139C73]/70"
        }
      `}
    >
      {checked && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  );
}