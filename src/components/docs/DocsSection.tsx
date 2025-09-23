interface DocsSectionProps {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function DocsSection({
  id,
  title,
  description,
  children,
}: DocsSectionProps) {
  return (
    <section id={id} className="mb-12 scroll-mt-20">
      <div className="mb-6">
        <h2 className="mb-2 scroll-m-20 text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground text-lg">{description}</p>
        )}
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}
