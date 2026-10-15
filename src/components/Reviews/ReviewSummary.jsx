"use client"; // Marks this module for client-side use in Next.js.

// Displays a placeholder for the restaurant review summary.
export async function GeminiSummary({ restaurantId }) { // Defines the summary component and receives the restaurant ID.
  // Show a message until review summarization is implemented.
  return ( // Returns the summary markup.
    <div className="restaurant__review_summary"> {/* Creates the summary container. */}
      <p>Review summary coming soon.</p> {/* Displays the placeholder message. */}
    </div>
  ); // Ends the return statement.
} // Ends the GeminiSummary component.

// Displays a loading message while the summary is being prepared.
export function GeminiSummarySkeleton() { // Defines the loading placeholder component.
  // Let users know the summary is being prepared.
  return ( // Returns the loading markup.
    <div className="restaurant__review_summary"> {/* Creates the loading container. */}
      <p>✨ Summarizing reviews with Gemini...</p> {/* Displays the loading message. */}
    </div>
  ); // Ends the return statement.
} // Ends the GeminiSummarySkeleton component.