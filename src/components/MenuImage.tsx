import { useState } from "react";
import menuPlaceholder from "@/assets/menu-placeholder.jpg";

interface Props {
  src: string | null | undefined;
  alt: string;
  className?: string;
}

export function MenuImage({ src, alt, className }: Props) {
  const [errored, setErrored] = useState(false);
  const finalSrc = !src || errored ? menuPlaceholder : src;
  return (
    <img
      src={finalSrc}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={className}
    />
  );
}
