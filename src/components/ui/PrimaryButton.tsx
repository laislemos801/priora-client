type Props = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function PrimaryButton({ children, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="
        px-4 py-2 rounded-md text-sm font-bold font-sans text-white
        bg-linear-to-r from-[#139C73] to-[#136D52]
        hover:opacity-90
        transition
      "
    >
      {children}
    </button>
  );
}