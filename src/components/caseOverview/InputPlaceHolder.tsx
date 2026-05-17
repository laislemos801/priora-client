type InputPlaceholderProps = {
  text: string;
};

export default function InputPlaceholder({ text }: InputPlaceholderProps) {
  return (
    <div className="rounded-full border border-[#4a4a4a] px-3 py-1 text-xs text-slate-500">
      {text}
    </div>
  );
}