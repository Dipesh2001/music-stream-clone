import { useState } from "react";

export function useLike(initialLiked = false) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const toggle = () => setIsLiked((v) => !v);
  return { isLiked, toggle };
}
