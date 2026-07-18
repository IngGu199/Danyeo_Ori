"use client";

import { DataError } from "../components/data-error";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <DataError reset={reset} />;
}
