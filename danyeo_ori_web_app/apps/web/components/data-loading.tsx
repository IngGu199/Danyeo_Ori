export function DataLoading({ label = "축제 정보를 불러오는 중이에요." }: { label?: string }) {
  return <section className="data-state"><div className="container"><p className="empty-state" role="status">{label}</p></div></section>;
}
