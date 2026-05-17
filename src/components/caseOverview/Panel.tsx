type PanelProps = {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export default function Panel({
  title,
  children,
  action,
  className = "bg-[#242424]",
}: PanelProps) {
  return (
    <section
      className={`overflow-hidden rounded-lg border border-[#3d3d3d] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[#3d3d3d] px-5 py-3">
        <h2 className="font-medium text-white">
          {title}
        </h2>

        {action}
      </div>

      <div className="p-5">
        {children}
      </div>
    </section>
  );
}