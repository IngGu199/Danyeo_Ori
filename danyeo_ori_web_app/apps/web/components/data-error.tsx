"use client";

export function DataError({ reset }: { reset: () => void }) {
  return (
    <main className="data-state">
      <div className="container">
        <div className="empty-state" role="alert">
          <p>축제 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>
          <button className="primary-btn" type="button" onClick={reset}>다시 시도</button>
        </div>
      </div>
    </main>
  );
}
