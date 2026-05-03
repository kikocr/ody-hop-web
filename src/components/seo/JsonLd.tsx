type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Trusted, server-built JSON; no user input flows into this string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
