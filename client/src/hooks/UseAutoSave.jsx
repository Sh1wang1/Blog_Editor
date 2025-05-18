import { useEffect, useRef } from "react";

export default function UseAutoSave(value, callback, delay = 5000) {
  const timeoutRef = useRef();

  useEffect(() => {
    if (!value.title || !value.content) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [value]);
}
