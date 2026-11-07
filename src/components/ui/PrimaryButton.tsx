type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export default function PrimaryButton({ children, onClick, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
        px-6 py-2 rounded-md text-sm font-bold font-sans text-white
        bg-linear-to-r from-[#139C73] to-[#136D52]
        hover:opacity-90
        disabled:cursor-not-allowed disabled:opacity-50
        transition
      "
    >
      {children}
    </button>
  );
}