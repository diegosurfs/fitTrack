"use client";

// Display a placeholder for the restaurant review summary.
export async function GeminiSummary({ restaurantId }) {
  // Show a message until review summarization is implemented.
  return (
    <div className="restaurant__review_summary">
      <p>Review summary coming soon.</p>
    </div>
  );
}

// Display a loading message while the summary is being prepared.
export function GeminiSummarySkeleton() {
  // Let users know the summary is being prepared.
  return (
    <div className="restaurant__review_summary">
      <p>✨ Summarizing reviews with Gemini...</p>
    </div>
  );
}