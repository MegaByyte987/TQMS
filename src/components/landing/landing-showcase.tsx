"use client";
import { useState, useEffect } from "react";

export function LandingShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Search", "Receipt", "Export"];

  useEffect(() => {
    // Initialize QR code grid
    document.querySelectorAll('[data-qr]').forEach((el: any) => {
      let s = '';
      for (let i = 0; i < 49; i++) {
        const x = i % 7, y = (i / 7) | 0;
        const c = (x < 3 && y < 3) || (x > 3 && y < 3) || (x < 3 && y > 3) || ((i * 7 + (i >> 1)) % 3 === 0);
        s += `<i${c ? '' : ' class="z"'}></i>`;
      }
      el.innerHTML = s;
    });

    // Initialize Calendar
    const cal = document.getElementById('cal');
    if (cal) {
      let c = 'SMTWTFS'.split('').map(d => `<span class="h">${d}</span>`).join('');
      for (let d = 1; d <= 30; d++) {
        c += `<span${d === 22 ? ' class="t"' : (d >= 15 && d < 22 ? ' class="rg"' : '')}>${d}</span>`;
      }
      cal.innerHTML = c;
    }
  }, []);

  return (
    <section style={{ paddingTop: 0, paddingBottom: 12 }}>
      <div className="dark">
        <div className="wrap c">
          <h2>Built for speed.</h2>
          <p className="sub">Search, switch and print without lifting your hands.</p>
          <div className="tabs" role="tablist" id="seg">
            {tabs.map((tab, i) => (
              <button 
                key={tab} 
                role="tab" 
                aria-selected={activeTab === i}
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="show" id="show">
            <div className={`card panel cmd ${activeTab === 0 ? 'data-on' : ''}`}>
              <div className="row" style={{ padding: '12px 16px', borderBottom: '1px solid var(--bd)' }}>
                <svg className="i mut"><use href="#search"/></svg>
                <span className="np">बा २ ख ४५२१</span>
                <kbd style={{ marginLeft: 'auto' }}>esc</kbd>
              </div>
              <div className="grp" style={{ paddingTop: 10 }}>Vehicles</div>
              <div className="it on">
                <img className="pf" style={{width:26, height:26}} alt="" src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23c9d3ff'/%3E%3Cpath d='M5 40c0-9 6-13 15-13s15 4 15 13z' fill='%2315803d'/%3E%3Ccircle cx='20' cy='17' r='7.5' fill='%23f1c9a5'/%3E%3Cpath d='M12 16c0-6 4-9 8.5-9s7.5 3 7.5 8c-2-3-5-4-8-4s-6 1-8 5z' fill='%233b2a20'/%3E%3C/svg%3E" />
                <span className="ell">Sita Transport</span>
                <span className="b ok" style={{ marginLeft: 'auto' }}>Weighing</span>
              </div>
              <div className="grp">Actions</div>
              <div className="it"><svg className="i"><use href="#print"/></svg>Issue receipt<kbd>⌘ P</kbd></div>
              <div className="it"><svg className="i"><use href="#flag"/></svg>Open checkpoint journey<kbd>⌘ J</kbd></div>
              <div className="it" style={{ marginBottom: 6 }}><svg className="i"><use href="#plus"/></svg>Add to queue<kbd>⌘ N</kbd></div>
            </div>
            <div className={`card panel ${activeTab === 1 ? 'data-on' : ''}`}>
              <div className="ch">
                <div><div className="ct">Print receipt #0418</div><div className="cd">Thermal printer · 80mm</div></div>
                <kbd>⌘ P</kbd>
              </div>
              <div className="cc">
                <div className="tk" style={{ padding: '12px 12px 26px' }}>
                  <h6 lang="ne">तौल रसिद · Weighbridge</h6>
                  <div className="dl"><span>Vehicle</span><i></i><b lang="ne">बा २ ख ४५२१</b></div>
                  <div className="dl"><span>Net</span><i></i><b>12,480 kg</b></div>
                  <div className="dl"><span>Amount</span><i></i><b>Rs. 1,500</b></div>
                </div>
              </div>
              <div className="cf"><span className="sb">Preview</span><span className="sb p"><svg className="i"><use href="#print"/></svg>Print</span></div>
            </div>
            <div className={`card panel ${activeTab === 2 ? 'data-on' : ''}`}>
              <div className="ch">
                <div><div className="ct">Export report</div><div className="cd">Checkpoint entries as CSV.</div></div>
              </div>
              <div className="cc">
                <div className="f2">
                  <div><span className="lb">From</span><div className="inp"><svg className="i mut"><use href="#cal"/></svg>2083-07-15</div></div>
                  <div><span className="lb">To</span><div className="inp"><svg className="i mut"><use href="#cal"/></svg>2083-07-22</div></div>
                </div>
                <div className="res">
                  <svg className="i"><use href="#dl"/></svg>
                  <div style={{ minWidth: 0 }}>
                    <b className="ell">checkpoint-entry-2083-07-22.csv</b>
                    <span className="xs mut">961 rows · opens in Excel</span>
                  </div>
                </div>
              </div>
              <div className="cf"><span className="sb">Cancel</span><span className="sb p"><svg className="i"><use href="#dl"/></svg>Export CSV</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}