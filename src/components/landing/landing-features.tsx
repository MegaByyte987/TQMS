export function LandingFeatures() {
  return (
    <section id="features" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <h2 className="c">Made for the desk.</h2>
        <div className="bento">
          <div className="card s7">
            <div className="ch">
              <div><div className="ct">Live queue</div><div className="cd">Refreshes every 15 seconds.</div></div>
              <span className="b d ok" id="rf">Live</span>
            </div>
            <div style={{ height: 12 }}></div>
            <div className="tw">
              <table>
                <thead><tr><th>Vehicle</th><th className="r">Weight</th><th className="r">Status</th></tr></thead>
                <tbody id="bq">
                  <tr className="fade"><td><div className="row"><span className="np" style={{height:22, fontSize:12}}>बा २ ख ४५२१</span></div></td><td className="r">12,480 kg</td><td className="r"><span className="b d ok">Weighing</span></td></tr>
                </tbody>
              </table>
            </div>
            <div className="cf" style={{ paddingTop: 14, justifyContent: 'stretch' }}>
              <div className="prog" style={{ flex: 1 }}><i id="pg"></i></div>
            </div>
          </div>
          <div className="card s5">
            <div className="ch">
              <div><div className="ct">Receipts</div><div className="cd">Nepali, 80mm thermal-ready.</div></div>
              <span className="b sec">Printed 148</span>
            </div>
            <div className="cc" style={{ alignContent: 'center' }}>
              <div className="stack">
                <div className="tk" style={{ left: 0, top: 16, transform: 'rotate(-5deg)', opacity: 0.92 }}>
                  <h6 lang="ne">तौल रसिद</h6>
                  <div className="dl"><span>Net</span><i></i><b>9,860 kg</b></div>
                  <div className="dl"><span>Amount</span><i></i><b>Rs. 1,200</b></div>
                </div>
                <div className="tk" style={{ right: 0, top: 0, transform: 'rotate(4deg)' }}>
                  <h6 lang="ne">तौल रसिद</h6>
                  <div className="dl"><span>Net</span><i></i><b>12,480 kg</b></div>
                  <div className="dl"><span>Amount</span><i></i><b>Rs. 1,500</b></div>
                  <div className="dl"><span>Date</span><i></i><b>2083-07-22</b></div>
                  <div className="qr" style={{ margin: '8px auto 0' }} data-qr></div>
                </div>
              </div>
            </div>
          </div>
          <div className="card s5">
            <div className="ch">
              <div><div className="ct">Checkpoint journey</div><div className="cd">Weight at each stop, with the difference.</div></div>
            </div>
            <div style={{ height: 12 }}></div>
            <div className="tw">
              <table>
                <thead><tr><th>Vehicle</th><th className="r">CP1</th><th className="r">CP2</th><th className="r">Δ</th></tr></thead>
                <tbody>
                  <tr><td><span className="np" style={{height:22, fontSize:11.5}}>बा २ ख ४५२१</span></td><td className="r">12,480</td><td className="r">12,470</td><td className="r"><span className="b ok">−10</span></td></tr>
                  <tr><td><span className="np" style={{height:22, fontSize:11.5}}>ना ५ प ११८०</span></td><td className="r">9,860</td><td className="r">9,860</td><td className="r"><span className="b ok">0</span></td></tr>
                  <tr><td><span className="np" style={{height:22, fontSize:11.5}}>ग १ च ७७३३</span></td><td className="r">14,220</td><td className="r">14,060</td><td className="r"><span className="b bad">−160</span></td></tr>
                  <tr><td><span className="np" style={{height:22, fontSize:11.5}}>प्र ३ ज ९०४२</span></td><td className="r">11,050</td><td className="r"><span className="mut">En route</span></td><td className="r"><span className="b">—</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="card s7">
            <div className="ch">
              <div><div className="ct">Vehicles and net weight</div><div className="cd">Daily totals across all checkpoints.</div></div>
              <div className="tabs" id="rt"><button aria-selected="true">7 days</button><button aria-selected="false">14 days</button></div>
            </div>
            <div className="cc">
              <div className="lgd"><span><i style={{background:'#bfd2ff'}}></i>Vehicles</span><span><i style={{background:'#1d4ed8'}}></i>Net weight (t)</span></div>
              <div className="chart" id="ch"></div>
              <div className="k4">
                <div><span className="xs mut">Vehicles</span><b>961</b><span className="b ok xs">+8.2%</span></div>
                <div><span className="xs mut">Net weight</span><b>11,904 t</b><span className="b ok xs">+5.1%</span></div>
                <div><span className="xs mut">Avg. wait</span><b>14 min</b><span className="b ok xs">−3 min</span></div>
                <div><span className="xs mut">Mismatches</span><b>9</b><span className="b bad xs">+2</span></div>
              </div>
            </div>
            <div className="cf"><span className="sb"><svg className="i"><use href="#dl"/></svg>Export CSV</span></div>
          </div>
          <div className="card s12">
            <div className="cc">
              <div className="calw">
                <div>
                  <h3 style={{fontSize:'1.5rem'}}>Bikram Sambat, throughout.</h3>
                  <p className="mut" style={{marginTop:6}}>Every filter, receipt and report speaks BS. AD is one tap away.</p>
                  <div className="dates" style={{marginTop:28}}>22 Kartik 2083<div className="mut" style={{fontSize:15, letterSpacing:0, fontWeight:400, marginTop:8}}>Sunday · 8 November 2026</div></div>
                </div>
                <div className="card" style={{background:'var(--bg)'}}>
                  <div className="ch"><div className="ct">Kartik 2083</div><div className="row"><span className="sb s">‹</span><span className="sb s">›</span></div></div>
                  <div className="cc">
                    <div className="cal" id="cal"></div>
                    <div className="row sp"><span className="xs mut">2083-07-15 → 2083-07-22</span><span className="b sec">8 days</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}