import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="foot">
      <div className="wrap c">
        <h2>Ready for the next shift?</h2>
        <div className="cta on-d">
          <Link className="btn btn--primary" href="/login">
            <span className="label label--primary">Open dashboard</span>
            <span className="label label--duplicate" aria-hidden="true">Open dashboard</span>
          </Link>
        </div>
        <nav className="links" aria-label="Footer">
          <Link href="/queue">Queue</Link>
          <Link href="/vehicle/vehicles">Vehicles</Link>
          <Link href="/reports/checkpoint-entry">Reports</Link>
          <Link href="/qr">Generate QR</Link>
        </nav>
      </div>
      <div className="ghost" aria-hidden="true">TQMS-Pulse</div>
    </footer>
  );
}