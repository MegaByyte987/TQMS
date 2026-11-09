"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// --- Avatar Generator ---
const SK = ['#f1c9a5','#d9a077','#b87b55','#8d5a3b','#e8b895'];
const HR = ['#1d1a1a','#3b2a20','#5a3b24','#111','#6b4a2f'];
const BG = ['#c9d3ff','#ffd9c9','#cdeedd','#f3d6f5','#ffe9a8'];
const SH = ['#2563eb','#18181b','#15803d','#b91c1c','#b45309'];

function getAvatar(i: number) {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="${BG[i%5]}"/><path d="M5 40c0-9 6-13 15-13s15 4 15 13z" fill="${SH[(i+2)%5]}"/><circle cx="20" cy="17" r="7.5" fill="${SK[i%5]}"/><path d="M12 16c0-6 4-9 8.5-9s7.5 3 7.5 8c-2-3-5-4-8-4s-6 1-8 5z" fill="${HR[(i+1)%5]}"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(s)}`;
}

// --- Hero Canvas Animation ---
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;
    const veh: any[] = [], pulses: any[] = [];
    let px = -999, py = -999, vis = true, t0 = 0;
    const LN = 6, GATES = [0.25, 0.5, 0.75];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lane = (i: number, xx: number) => h * (0.5 + i * 0.085) + Math.sin(xx / w * 6.283 + i * 0.9) * 9;
    
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    
    const seed = () => {
      veh.length = 0;
      const cnt = Math.round(Math.min(46, Math.max(18, w / 30)));
      for (let i = 0; i < cnt; i++) {
        veh.push({ l: i % LN, x: Math.random() * w, v: 0.35 + Math.random() * 0.7, len: 12 + Math.random() * 10, kg: Math.round(7000 + Math.random() * 9000) });
      }
    };

    const frame = (ts: number) => {
      if (!vis) { requestAnimationFrame(frame); return; }
      const dt = Math.min(32, ts - t0 || 16) / 16; t0 = ts;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      
      for (let i = 0; i < LN; i++) {
        ctx.beginPath(); ctx.strokeStyle = 'rgba(160,185,255,.10)';
        for (let xx = 0; xx <= w; xx += 12) {
          const y = lane(i, xx); xx ? ctx.lineTo(xx, y) : ctx.moveTo(xx, y);
        }
        ctx.stroke();
      }
      
      ctx.font = '600 10px -apple-system,Helvetica,Arial'; ctx.textAlign = 'center';
      GATES.forEach((g, k) => {
        const gx = w * g;
        ctx.strokeStyle = 'rgba(160,185,255,.2)'; ctx.setLineDash([3, 5]);
        ctx.beginPath(); ctx.moveTo(gx, h * 0.46); ctx.lineTo(gx, h * 0.46 + LN * h * 0.085 + 8); ctx.stroke();
        ctx.setLineDash([]); ctx.fillStyle = 'rgba(190,205,255,.45)';
        ctx.fillText(`CP${k + 1}`, gx, h * 0.46 - 6);
      });

      const R = Math.min(150, w * 0.22);
      let near: any = null, nd = 1e9;

      veh.forEach((o: any) => {
        const y = lane(o.l, o.x);
        const d = Math.hypot(px - o.x, py - y);
        const f = d < R ? 0.22 + 0.78 * (d / R) : 1;
        o.px = o.x; o.x += o.v * f * dt * 1.2;
        
        GATES.forEach((g) => {
          const gx = w * g;
          if (o.px < gx && o.x >= gx) pulses.push({ x: gx, y, t: 0 });
        });
        
        if (o.x > w + 30) { o.x = -30; o.l = (Math.random() * LN) | 0; o.kg = Math.round(7000 + Math.random() * 9000); }
        
        const hot = d < R, a = hot ? 0.95 : 0.38;
        if (d < nd && d < R) { nd = d; near = o; }
        
        const grd = ctx.createLinearGradient(o.x - o.len * 3.5, 0, o.x, 0);
        grd.addColorStop(0, 'rgba(150,180,255,0)');
        grd.addColorStop(1, `rgba(150,180,255,${hot ? 0.5 : 0.18})`);
        ctx.fillStyle = grd;
        ctx.fillRect(o.x - o.len * 3.5, y - 1.5, o.len * 3.5, 3);
        
        ctx.fillStyle = hot ? `rgba(125,211,252,${a})` : `rgba(220,230,255,${a})`;
        ctx.beginPath();
        if ((ctx as any).roundRect) (ctx as any).roundRect(o.x - o.len / 2, y - 4, o.len, 8, 3);
        else ctx.rect(o.x - o.len / 2, y - 4, o.len, 8);
        ctx.fill();
        o.y = y;
      });

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]; p.t += dt * 0.03;
        if (p.t > 1) { pulses.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(125,211,252,${0.5 * (1 - p.t)})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(p.x, p.y, 4 + p.t * 22, 0, 6.283); ctx.stroke();
      }

      if (px > -900) {
        ctx.strokeStyle = 'rgba(180,205,255,.45)'; ctx.lineWidth = 1; ctx.setLineDash([4, 6]); ctx.lineDashOffset = -ts / 60;
        ctx.beginPath(); ctx.arc(px, py, R, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
        if (near) {
          ctx.fillStyle = 'rgba(8,12,50,.8)';
          const tx = near.x, ty = near.y - 22, s = near.kg.toLocaleString('en-NP') + ' kg';
          ctx.beginPath();
          const tw = ctx.measureText(s).width + 16;
          if ((ctx as any).roundRect) (ctx as any).roundRect(tx - tw / 2, ty - 11, tw, 18, 9);
          else ctx.rect(tx - tw / 2, ty - 11, tw, 18);
          ctx.fill(); ctx.strokeStyle = 'rgba(125,211,252,.7)'; ctx.stroke();
          ctx.fillStyle = '#e6f0ff'; ctx.fillText(s, tx, ty + 2);
        }
      }
      if (!reduce) requestAnimationFrame(frame);
    };

    size(); seed();
    const obs = new ResizeObserver(() => { size(); seed(); });
    obs.observe(canvas);
    
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      px = e.clientX - r.left; py = e.clientY - r.top;
      if (px < 0 || py < 0 || px > r.width || py > r.height) { px = -999; py = -999; }
    };
    const onLeave = () => { px = -999; py = -999; };
    
    canvas.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    const io = new IntersectionObserver((e) => { vis = e[0].isIntersecting; });
    io.observe(canvas);
    requestAnimationFrame(frame);

    return () => {
      obs.disconnect(); io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} id="hc" aria-hidden="true" />;
}

// --- Live Queue Table ---
export function LandingHero() {
  const PL = ['बा २ ख ४५२१','ना ५ प ११८०','ग १ च ७७३३','प्र ३ ज ९०४२','को २ ख २२१६','लु ४ प ५५०९'];
  const OW = ['Sita Transport','Himal Cargo','Everest Freight','Gorkha Lines','Terai Movers','Koshi Carriers'];
  const KG = [12480,9860,14220,11050,8730,13390];
  
  const [pend, setPend] = useState<any[]>([]);
  const [job, setJob] = useState<any[]>([]);
  const [left, setLeft] = useState(15);

  useEffect(() => {
    let n = 0;
    const initPend = [], initJob = [];
    for (let i = 0; i < 3; i++) { const idx = n++ % 6; initPend.push({ p: PL[idx], w: OW[idx], k: KG[idx], a: idx }); }
    for (let i = 0; i < 2; i++) { const idx = n++ % 6; initJob.push({ p: PL[idx], w: OW[idx], k: KG[idx], a: idx }); }
    setPend(initPend); setJob(initJob);

    const interval = setInterval(() => {
      setLeft(prev => {
        if (prev <= 1) {
          setJob(prevJob => {
            const nj = [...prevJob]; if (nj.length > 2) nj.shift();
            setPend(prevPend => {
              const np = [...prevPend];
              if (np.length > 0) nj.push(np.shift()!);
              const idx = n++ % 6; np.push({ p: PL[idx], w: OW[idx], k: KG[idx], a: idx });
              return np;
            });
            return nj;
          });
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero">
      <div className="hbg"><HeroCanvas /></div>
      <div className="wrap c">
        <h1>Run every checkpoint at full speed.</h1>
        <p className="sub">Queues, receipts and reconciliation in one keyboard-first dashboard.</p>
        <div className="cta on-d">
          <Link className="btn btn--primary" href="/login">
            <span className="label label--primary">Open dashboard</span>
            <span className="label label--duplicate" aria-hidden="true">Open dashboard</span>
          </Link>
          <Link className="btn btn--ghost" href="#flow">See how it works</Link>
        </div>
        <div className="stage">
          <div className="fl l">
            <div className="tk">
              <h6 lang="ne">तौल रसिद</h6>
              <div className="dl"><span>Net</span><i></i><b>12,480 kg</b></div>
              <div className="dl"><span>Amount</span><i></i><b>Rs. 1,500</b></div>
              <div className="dl"><span>Date</span><i></i><b>2083-07-22</b></div>
            </div>
          </div>
          <div className="fl r">
            <div className="toast">
              <span className="b ok" style={{ height: 28, width: 28, padding: 0, justifyContent: 'center' }}>
                <svg className="i"><use href="#ok" /></svg>
              </span>
              <div style={{ minWidth: 0 }}>
                <b style={{ fontSize: 14, display: 'block', lineHeight: 1.3 }}>CP2 cleared</b>
                <span className="xs mut nw">12,470 kg · Bill 0418</span>
              </div>
            </div>
          </div>
          <div className="app">
            <aside className="side">
              <div className="lg"><i><svg className="i" style={{ width: 13, height: 13 }}><use href="#tr" /></svg></i>TQMS-Pulse</div>
              <small>Operations</small>
              <Link className="on" href="/queue"><svg className="i"><use href="#list" /></svg>Queue</Link>
              <Link href="/queue/new"><svg className="i"><use href="#plus" /></svg>Add queue</Link>
              <Link href="/vehicle/vehicles"><svg className="i"><use href="#tr" /></svg>Vehicles</Link>
              <Link href="/checkpoints"><svg className="i"><use href="#flag" /></svg>Checkpoints</Link>
              <small>Records</small>
              <Link href="/reports/checkpoint-entry"><svg className="i"><use href="#chart" /></svg>Reports</Link>
              <Link href="/qr"><svg className="i"><use href="#qrs" /></svg>Generate QR</Link>
              <div className="me">
                <img className="pf" width="32" height="32" alt="" src={getAvatar(1)} />
                <div><b className="sm" style={{ display: 'block' }}>Ramesh K.</b><span className="xs mut">Operator · CP1</span></div>
              </div>
            </aside>
            <div className="main">
              <div className="top">
                <b>Queue</b>
                <span className="inp" style={{ height: 34, width: 200 }}>
                  <svg className="i"><use href="#search" /></svg>
                  <span className="mut">Search plate…</span>
                  <kbd>⌘K</kbd>
                </span>
                <Link className="sb p" href="/queue/new">
                  <svg className="i"><use href="#plus" /></svg>Add queue
                </Link>
              </div>
              <div className="kpis">
                <div className="card kpi"><div className="l">Pending<svg className="i"><use href="#list" /></svg></div><b>{pend.length}</b><div className="xs"><span className="up">+2</span> since last refresh</div></div>
                <div className="card kpi"><div className="l">In job<svg className="i"><use href="#tr" /></svg></div><b>{job.length}</b><div className="xs">Weighing now</div></div>
                <div className="card kpi"><div className="l">Completed today<svg className="i"><use href="#ok" /></svg></div><b>148</b><div className="xs"><span className="up">+12.5%</span> from yesterday</div></div>
                <div className="card kpi"><div className="l">Avg. wait<svg className="i"><use href="#flag" /></svg></div><b>14 min</b><div className="xs"><span className="up">−3 min</span> from yesterday</div></div>
              </div>
              <div className="card">
                <div className="ch">
                  <div><div className="ct">Live queue</div><div className="cd">Pending and in-job vehicles at CP1.</div></div>
                  <div className="tabs">
                    <button aria-selected="true">All</button>
                    <button aria-selected="false">In job</button>
                    <button aria-selected="false">In queue</button>
                  </div>
                </div>
                <div style={{ height: 12 }}></div>
                <div className="tw">
                  <table>
                    <thead>
                      <tr><th>Vehicle</th><th className="h1">Owner</th><th className="r">Weight</th><th className="r h2">Wait</th><th className="r">Status</th></tr>
                    </thead>
                    <tbody>
                      {job.map((o: any, i: number) => (
                        <tr key={`j${i}`} className="fade">
                          <td><div className="row"><img className="pf" width="30" height="30" alt="" src={getAvatar(o.a)} /><div style={{ minWidth: 0 }}><span className="np" style={{ height: 22, fontSize: 12 }}>{o.p}</span><div className="xs mut ell" style={{ marginTop: 3 }}>{o.w}</div></div></div></td>
                          <td className="r">{o.k.toLocaleString('en-NP')} kg</td>
                          <td className="r h2 mut">{(i + 1) * 4} min</td>
                          <td className="r"><span className="b d ok">Weighing</span></td>
                        </tr>
                      ))}
                      {pend.map((o: any, i: number) => (
                        <tr key={`p${i}`} className="fade">
                          <td><div className="row"><img className="pf" width="30" height="30" alt="" src={getAvatar(o.a)} /><div style={{ minWidth: 0 }}><span className="np" style={{ height: 22, fontSize: 12 }}>{o.p}</span><div className="xs mut ell" style={{ marginTop: 3 }}>{o.w}</div></div></div></td>
                          <td className="r">{o.k.toLocaleString('en-NP')} kg</td>
                          <td className="r h2 mut">{(i * 9 + 6)} min</td>
                          <td className="r"><span className="b d sec">In queue #{i + 1}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="cf" style={{ paddingTop: 14, justifyContent: 'stretch' }}>
                  <div className="prog" style={{ flex: 1 }}><i style={{ '--w': `${((15 - left) / 15) * 100}%` } as any}></i></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}