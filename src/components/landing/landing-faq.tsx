export function LandingFAQ() {
  return (
    <section id="faq">
      <div className="wrap">
        <h2 className="c">Questions</h2>
        <div className="faq">
          <details open>
            <summary>Does it print to thermal printers?</summary>
            <p>Yes. Receipts print at 80mm.</p>
          </details>
          <details>
            <summary>Are dates in Bikram Sambat?</summary>
            <p>Everywhere, with AD available when you need it.</p>
          </details>
          <details>
            <summary>How often does the queue update?</summary>
            <p>Every 15 seconds, automatically.</p>
          </details>
          <details>
            <summary>Can I export reports?</summary>
            <p>Yes, as CSV files that open cleanly in Excel.</p>
          </details>
        </div>
      </div>
    </section>
  );
}