export function LandingFlow() {
  return (
    <section id="flow" style={{ paddingTop: 'clamp(40px,6vw,80px)' }}>
      <div className="wrap">
        <h2 className="c">Three steps. Every checkpoint.</h2>
        <div className="steps">
          <article className="step">
            <div className="sh"><i>1</i></div>
            <h3>Add to queue</h3>
            <p>Find the plate. It takes the next turn.</p>
            <div className="card">
              <div className="ch">
                <div><div className="ct">New queue entry</div><div className="cd">Search by plate or owner.</div></div>
                <span className="b sec">#4 next</span>
              </div>
              <div className="cc">
                <div><span className="lb">Vehicle number</span><div className="inp"><svg className="i mut"><use href="#search"/></svg><span className="np">बा २ ख ४५२१</span></div></div>
                <div className="res">
                  <img className="pf" style={{width:38, height:38}} alt="" src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23c9d3ff'/%3E%3Cpath d='M5 40c0-9 6-13 15-13s15 4 15 13z' fill='%2315803d'/%3E%3Ccircle cx='20' cy='17' r='7.5' fill='%23f1c9a5'/%3E%3Cpath d='M12 16c0-6 4-9 8.5-9s7.5 3 7.5 8c-2-3-5-4-8-4s-6 1-8 5z' fill='%233b2a20'/%3E%3C/svg%3E" />
                  <div style={{minWidth:0}}><b className="ell">Sita Transport</b><span className="xs mut">10-wheeler · last 12,380 kg</span></div>
                  <span className="b ok" style={{marginLeft:'auto'}}>Registered</span>
                </div>
                <div><span className="lb">Checkpoint</span><div className="inp"><svg className="i mut"><use href="#flag"/></svg>CP1 · Main gate<svg className="i mut"><use href="#chev"/></svg></div></div>
              </div>
              <div className="cf"><span className="sb">Cancel</span><span className="sb p">Add to queue</span></div>
            </div>
          </article>
          <article className="step">
            <div className="sh"><i>2</i></div>
            <h3>Weigh and print</h3>
            <p>A clean receipt in one click.</p>
            <div className="card">
              <div className="ch">
                <div><div className="ct">Issue receipt</div><div className="cd">Weight is recorded in whole kilograms.</div></div>
                <span className="b">#0418</span>
              </div>
              <div className="cc">
                <div className="f2">
                  <div><span className="lb">Gross</span><div className="inp">18,240<span className="mut">kg</span></div></div>
                  <div><span className="lb">Tare</span><div className="inp">5,760<span className="mut">kg</span></div></div>
                </div>
                <div className="sep"></div>
                <div className="kv"><span className="mut">Net weight</span><b style={{fontSize:'1.4rem', letterSpacing:'-.04em'}}>12,480 kg</b></div>
                <div className="kv"><span className="mut">Amount</span><b>Rs. 1,500.00</b></div>
                <div className="kv"><span className="mut">Date</span><b>2083-07-22</b></div>
              </div>
              <div className="cf"><span className="sb">Save draft</span><span className="sb p"><svg className="i"><use href="#print"/></svg>Print receipt</span></div>
            </div>
          </article>
          <article className="step">
            <div className="sh"><i>3</i></div>
            <h3>Reconcile</h3>
            <p>Weight and bills follow the truck.</p>
            <div className="card">
              <div className="ch">
                <div><div className="ct">Checkpoint journey</div><div className="cd">2 of 3 checkpoints cleared.</div></div>
                <span className="np" style={{height:24, fontSize:12}}>बा २ ख ४५२१</span>
              </div>
              <div className="cc">
                <div className="prog"><i style={{'--w':'66%'} as any}></i></div>
                <div className="tl">
                  <div className="tn"><div className="dot"><span><svg className="i" style={{width:14, height:14}}><use href="#ok"/></svg></span></div><div><b>CP1 · Entry</b><span className="xs mut">09:12</span><div className="chips"><span className="b">12,480 kg</span><span className="b sec">Bill 0418</span></div></div></div>
                  <div className="tn"><div className="dot"><span><svg className="i" style={{width:14, height:14}}><use href="#ok"/></svg></span></div><div><b>CP2 · Midway</b><span className="xs mut">10:05</span><div className="chips"><span className="b">12,470 kg</span><span className="b sec">Bill 0418</span></div></div></div>
                  <div className="tn p n"><div className="dot"><span><svg className="i" style={{width:13, height:13}}><use href="#tr"/></svg></span></div><div><b>CP3 · Exit</b><span className="xs mut">Expected 11:00</span></div></div>
                </div>
                <div className="alert"><svg className="i" style={{marginTop:2}}><use href="#info"/></svg><span>10 kg difference between CP1 and CP2, within tolerance.</span></div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}