const compactNumberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const galleryDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "numeric",
  day: "numeric",
  year: "numeric",
});

export function formatCompactNumber(value: number) {
  return compactNumberFormatter.format(value);
}

export function formatGalleryDate(value: string) {
  return galleryDateFormatter.format(new Date(value));
}
