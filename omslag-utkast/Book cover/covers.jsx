// covers.jsx — Basaliteter wraparound cover variants

// ---- Tweakable defaults (host rewrites this JSON) -----------------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#b48a3c",
  "title": "Basaliteter",
  "author": "Kjetil Grunnvoll",
  "publisher": "HALV MATER FORLAG",
  "spineYear": "2026",
  "showCropMarks": true,
  "showTrim": false
}/*EDITMODE-END*/;

// ---- Shared constants --------------------------------------------
const PX_PER_MM = 3.5;
const PANEL_MM = 135;       // 135 mm wide front / back
const SPINE_MM = 20;        // 20 mm hardcover spine (approx)
const HEIGHT_MM = 210;

const PANEL_W = Math.round(PANEL_MM * PX_PER_MM);   // 472
const SPINE_W = 16;                                   // ~4.6 mm — accurate limfrest
const COVER_H = Math.round(HEIGHT_MM * PX_PER_MM);  // 735
const COVER_W = PANEL_W * 2 + SPINE_W;              // 960

const BLURB = `En liten samling dikt om aleneheten som valg. Om det som glir bort i stillhet, og om humoren som melder seg når alvoret har gått hjem.`;
const BLURB_TAIL = `Basaliteter er Kjetil Grunnvolls første utgivelse.`;
const POEM = ['Jeg har bare', 'disse ordene', '', 'disse ordene', 'er alt', 'jeg har'];
const ISBN_TEXT = '9 788293 044171';

// ---- Tiny atoms ---------------------------------------------------
const Logo = ({ size = 40, invert = false, opacity = 0.85 }) => (
  <img
    src="assets/hm-logo.png"
    alt="Halv Mater Forlag"
    style={{
      width: size,
      height: size,
      opacity,
      filter: invert ? 'invert(1) brightness(0.92) contrast(0.9)' : 'none',
      display: 'block',
    }}
  />
);

// Deterministic barcode (no Math.random in render).
const BARS = '13121132121131221213112132231213111221312131121213';
const ISBNBars = ({ width, height, color = '#000' }) => {
  let totalUnits = 0;
  for (const c of BARS) totalUnits += parseInt(c, 10);
  const unit = width / totalUnits;
  const els = []; let x = 0;
  for (let i = 0; i < BARS.length; i++) {
    const bw = parseInt(BARS[i], 10) * unit;
    if (i % 2 === 0) els.push(<rect key={i} x={x} y={0} width={bw} height={height} fill={color} />);
    x += bw;
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {els}
    </svg>
  );
};

// Legacy compact ISBN used by V2/V3/V4 back covers.
const ISBN = ({ dark = false }) => {
  const w = 96, h = 36;
  return (
    <div style={{
      background: dark ? '#e8dfcc' : '#fff',
      padding: '4px 6px 3px',
      width: w, boxSizing: 'border-box',
      fontFamily: 'ui-monospace, Menlo, monospace',
      color: '#000',
    }}>
      <ISBNBars width={w - 12} height={h - 14} />
      <div style={{ fontSize: 6.5, letterSpacing: 0.5, marginTop: 2, textAlign: 'center' }}>
        ISBN {ISBN_TEXT}
      </div>
    </div>
  );
};

// Rectangular ISBN box. `withPublisher` puts the publisher name (small caps)
// inside the box above the barcode. Roughly 48×23 mm at print size — wider
// than tall, like a classic Norwegian back-cover EAN block.
const ISBNBox = ({ withPublisher = false, publisher = '', dark = false }) => {
  const w = 220, padX = 14, barW = w - padX * 2;
  return (
    <div style={{
      background: dark ? '#e8dfcc' : '#fff',
      color: '#000',
      padding: '10px 14px 9px',
      width: w, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 7,
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    }}>
      {withPublisher && (
        <>
          <div style={{
            fontSize: 16, letterSpacing: 2.4, textAlign: 'center', fontWeight: 500,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{publisher}</div>
          <div style={{ height: 0.5, background: '#000', opacity: 0.35 }} />
        </>
      )}
      <ISBNBars width={barW} height={28} />
      <div style={{
        fontFamily: 'ui-monospace, Menlo, monospace',
        fontSize: 16, letterSpacing: 1.4, textAlign: 'center',
        whiteSpace: 'nowrap',
      }}>ISBN {ISBN_TEXT}</div>
    </div>
  );
};

// Optional crop marks + spine fold lines drawn outside / over the cover.
const CropMarks = ({ show, showTrim }) => {
  if (!show) return null;
  const m = 14; // marks length
  const off = 0;
  const C = ({ x, y, dir = 'tl' }) => {
    const dx = dir.includes('r') ? -m : m;
    const dy = dir.includes('b') ? -m : m;
    return (
      <g stroke="rgba(0,0,0,0.55)" strokeWidth="0.5" fill="none">
        <line x1={x} y1={y} x2={x + dx} y2={y} />
        <line x1={x} y1={y} x2={x} y2={y + dy} />
      </g>
    );
  };
  return (
    <svg style={{
      position: 'absolute', inset: -20, width: 'calc(100% + 40px)', height: 'calc(100% + 40px)',
      pointerEvents: 'none',
    }}>
      <C x={20} y={20} dir="tl" />
      <C x={COVER_W + 20} y={20} dir="tr" />
      <C x={20} y={COVER_H + 20} dir="bl" />
      <C x={COVER_W + 20} y={COVER_H + 20} dir="br" />
      {showTrim && (
        <g stroke="rgba(180,138,60,0.55)" strokeWidth="0.5" strokeDasharray="3 4" fill="none">
          <line x1={20 + PANEL_W} y1={20} x2={20 + PANEL_W} y2={COVER_H + 20} />
          <line x1={20 + PANEL_W + SPINE_W} y1={20} x2={20 + PANEL_W + SPINE_W} y2={COVER_H + 20} />
        </g>
      )}
    </svg>
  );
};

// Wrapper that places three panels (back | spine | front) side-by-side.
const Cover = ({ bg, ink, accent, t, showCropMarks, showTrim, children: [back, spine, front] }) => (
  <div style={{ position: 'relative', width: COVER_W, height: COVER_H }}>
    <div style={{
      position: 'absolute', inset: 0,
      display: 'grid',
      gridTemplateColumns: `${PANEL_W}px ${SPINE_W}px ${PANEL_W}px`,
      background: bg, color: ink,
      fontFamily: '"EB Garamond", "Sabon", Georgia, serif',
      boxShadow: '0 30px 60px -20px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.08)',
      overflow: 'hidden',
    }}>
      {back}
      {spine}
      {front}
    </div>
    <CropMarks show={showCropMarks} showTrim={showTrim} />
  </div>
);

// ---- Reusable panels ---------------------------------------------
const BackPanel = ({ ink, accent, poemItalic = true, t, variant = 'plain' }) => {
  const isDark = ink !== '#1a1815' && ink !== '#191713';
  return (
    <div style={{
      position: 'relative', padding: '70px 56px 52px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      color: ink, height: '100%', boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
        <div style={{
          fontSize: 21, lineHeight: 1.45,
          fontStyle: poemItalic ? 'italic' : 'normal',
          fontWeight: 400, overflow: 'hidden',
        }}>
          {POEM.map((l, i) => (
            <div key={i} style={{ minHeight: l ? undefined : '0.9em', whiteSpace: 'nowrap' }}>{l || '\u00a0'}</div>
          ))}
        </div>
        <div style={{
          fontSize: 13.5, lineHeight: 1.6, maxWidth: 320,
          textWrap: 'pretty', color: ink, opacity: 0.92,
        }}>
          <p style={{ margin: 0 }}>{BLURB}</p>
          <p style={{ margin: '16px 0 0' }}>{BLURB_TAIL}</p>
        </div>
      </div>
      <BackStrip ink={ink} t={t} dark={isDark} />
    </div>
  );
};

const SpinePanel = ({ ink, accent, t, layout = 'classic' }) => {
  const isDark = ink !== '#1a1815' && ink !== '#191713';
  const svgH = COVER_H - 80;
  return (
    <div style={{
      position: 'relative',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'space-between', padding: '24px 0 18px',
      borderLeft: `0.5px solid ${ink}22`, borderRight: `0.5px solid ${ink}22`,
      color: ink, overflow: 'hidden',
    }}>
      <svg width="16" height="10" viewBox="0 0 16 10">
        <text x="8" y="8" textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="6" letterSpacing="0.5" fill={ink} opacity="0.4"
        >{t.spineYear}</text>
      </svg>
      <svg width="16" height={svgH} viewBox={`0 0 16 ${svgH}`} style={{ display: 'block', flex: 1 }}>
        <text
          transform={`translate(11, ${Math.round(svgH / 2)}) rotate(-90)`}
          textAnchor="middle"
          fontFamily='"EB Garamond", "Sabon", Georgia, serif'
          fontSize="10"
          letterSpacing="0.4"
          fontStyle={layout === 'italic' ? 'italic' : 'normal'}
          fill={ink}
        >{t.title}</text>
      </svg>
      <Logo size={11} opacity={0.75} invert={isDark} />
    </div>
  );
};

// Oktober-style bottom strip: barcode left, logo-above-name right.
// SVG text for sub-16px labels to bypass browser font-size minimum.
const BackStrip = ({ ink, t, dark = false }) => {
  const isbnColor = dark ? '#e8e1cf' : ink;
  const barcodeW = 72, barcodeH = 26;
  return (
    <div style={{
      borderTop: `0.5px solid ${ink}40`,
      paddingTop: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        {/* Left: barcode + ISBN digits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
          <ISBNBars width={barcodeW} height={barcodeH} color={isbnColor} />
          <div style={{
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: 11, letterSpacing: 1,
            color: ink, whiteSpace: 'nowrap',
            zoom: 0.7,
          }}>ISBN {ISBN_TEXT}</div>
        </div>
        {/* Right: logo above publisher name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
          <Logo size={20} invert={dark} opacity={0.85} />
          <div style={{
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            fontSize: 11, letterSpacing: 1.8,
            color: ink, opacity: 0.85, whiteSpace: 'nowrap',
            zoom: 0.7,
          }}>{t.publisher}</div>
        </div>
      </div>
    </div>
  );
};

// V1 back: poem sits in upper third, pushed inward (towards spine), Oktober strip.
const BackV1 = ({ ink, t }) => {
  const isDark = ink !== '#1a1815' && ink !== '#191713';
  return (
    <div style={{
      position: 'relative',
      padding: '70px 56px 52px 92px',
      display: 'flex', flexDirection: 'column',
      color: ink, height: '100%', boxSizing: 'border-box',
    }}>
      <div style={{ height: 40 }} />
      <div style={{ fontSize: 22, lineHeight: 1.55, fontStyle: 'italic', overflow: 'hidden', maxWidth: '100%' }}>
        {POEM.map((l, i) => (
          <div key={i} style={{ minHeight: l ? undefined : '0.9em', whiteSpace: 'nowrap' }}>{l || '\u00a0'}</div>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <BackStrip ink={ink} t={t} dark={isDark} />
    </div>
  );
};

// V5 back: same treatment.
const BackV5 = ({ ink, t }) => {
  const isDark = ink !== '#1a1815' && ink !== '#191713';
  return (
    <div style={{
      position: 'relative',
      padding: '70px 56px 52px 92px',
      display: 'flex', flexDirection: 'column',
      color: ink, height: '100%', boxSizing: 'border-box',
    }}>
      <div style={{ height: 40 }} />
      <div style={{ fontSize: 22, lineHeight: 1.55, fontStyle: 'italic', overflow: 'hidden', maxWidth: '100%' }}>
        {POEM.map((l, i) => (
          <div key={i} style={{ minHeight: l ? undefined : '0.9em', whiteSpace: 'nowrap' }}>{l || '\u00a0'}</div>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <BackStrip ink={ink} t={t} dark={isDark} />
    </div>
  );
};

// =================================================================
// Variant 1 — KLASSISK
// Centered, all-type, cream. A 1960s Gyldendal-feel.
// =================================================================
const V1 = ({ t }) => {
  const bg = '#f1ead8', ink = '#1a1815', accent = t.accentColor;
  return (
    <Cover bg={bg} ink={ink} accent={accent} t={t} showCropMarks={t.showCropMarks} showTrim={t.showTrim}>
      <BackV1 ink={ink} t={t} />
      <SpinePanel ink={ink} accent={accent} t={t} />
      {/* FRONT */}
      <div style={{
        padding: '56px 56px 56px',
        display: 'flex', flexDirection: 'column',
        color: ink,
      }}>
        <div style={{
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          fontSize: 10.5, letterSpacing: 3.4, textTransform: 'uppercase',
          opacity: 0.78,
        }}>Dikt</div>
        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'left' }}>
          <div style={{
            fontSize: 60, lineHeight: 1.0, fontWeight: 500,
            letterSpacing: -0.5,
          }}>{t.title}</div>
          <div style={{
            marginTop: 14,
            fontSize: 17, fontStyle: 'italic', opacity: 0.85,
          }}>{t.author}</div>
        </div>
        <div style={{ flex: 1.6 }} />
        <div style={{
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          fontSize: 9, letterSpacing: 2.6,
          opacity: 0.75, textTransform: 'uppercase',
        }}>{t.publisher}</div>
      </div>
    </Cover>
  );
};

// =================================================================
// Variant 2 — MODERNIST BAND
// Accent band across lower third. Title reversed out in cream.
// =================================================================
const V2 = ({ t }) => {
  const bg = '#ece4d3', ink = '#1a1815', accent = t.accentColor;
  return (
    <Cover bg={bg} ink={ink} accent={accent} t={t} showCropMarks={t.showCropMarks} showTrim={t.showTrim}>
      <BackPanel ink={ink} accent={accent} t={t} />
      {/* spine */}
      <div style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'space-between', padding: '24px 0 0',
        color: ink, overflow: 'hidden',
        borderLeft: `0.5px solid ${ink}22`, borderRight: `0.5px solid ${ink}22`,
      }}>
        <svg width="16" height="10" viewBox="0 0 16 10">
          <text x="8" y="8" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="6" fill={ink} opacity="0.4">{t.spineYear}</text>
        </svg>
        <svg width="16" height={COVER_H - 80} viewBox={`0 0 16 ${COVER_H - 80}`} style={{ flex: 1, display: 'block' }}>
          <text
            transform={`translate(11, ${Math.round((COVER_H - 80) / 2)}) rotate(-90)`}
            textAnchor="middle"
            fontFamily='"EB Garamond", Georgia, serif'
            fontSize="10" letterSpacing="0.4" fill={ink}
          >{t.title}</text>
        </svg>
        <div style={{ background: accent, width: '100%', height: 16 }} />
      </div>
      {/* front */}
      <div style={{
        padding: '56px 56px 0',
        display: 'flex', flexDirection: 'column',
        color: ink,
      }}>
        <div style={{
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          fontSize: 10.5, letterSpacing: 3.4, textTransform: 'uppercase', opacity: 0.78,
        }}>Dikt — {t.spineYear}</div>
        <div style={{ flex: 1 }} />
        <div style={{ flex: 1 }} />
        {/* lower band on front carries title */}
        <div style={{
          marginLeft: -56, marginRight: -56,
          background: accent, color: bg,
          height: 132,
          padding: '0 56px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{
            fontSize: 46, lineHeight: 1.0, fontWeight: 500, letterSpacing: -0.4,
          }}>{t.title}</div>
          <div style={{
            marginTop: 8, fontSize: 16, fontStyle: 'italic', opacity: 0.92,
          }}>{t.author}</div>
        </div>
      </div>
    </Cover>
  );
};

// =================================================================
// Variant 3 — DYP NATT
// Dark ink-blue, italic small title, lots of room above.
// =================================================================
const V3 = ({ t }) => {
  const bg = '#22303c', ink = '#e8e1cf', accent = t.accentColor;
  return (
    <Cover bg={bg} ink={ink} accent={accent} t={t} showCropMarks={t.showCropMarks} showTrim={t.showTrim}>
      <BackPanel ink={ink} accent={accent} t={t} poemItalic={true} />
      <SpinePanel ink={ink} accent={accent} t={t} layout="italic" />
      <div style={{
        padding: '56px 56px',
        display: 'flex', flexDirection: 'column',
        color: ink,
      }}>
        <div style={{
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          fontSize: 10.5, letterSpacing: 3.4, textTransform: 'uppercase',
          opacity: 0.6,
        }}>Dikt</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
          <div style={{
            width: 4, height: 4, background: accent, borderRadius: '50%',
            transform: 'translateY(-12px)',
          }} />
          <div>
            <div style={{
              fontSize: 56, lineHeight: 1.0, fontStyle: 'italic', fontWeight: 400,
              letterSpacing: -0.3,
            }}>{t.title}</div>
            <div style={{
              marginTop: 18,
              fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              fontSize: 10.5, letterSpacing: 2.6, textTransform: 'uppercase',
              opacity: 0.75,
            }}>{t.author}</div>
          </div>
        </div>
        <div style={{ flex: 1.2 }} />
        <div style={{
          borderTop: `0.5px solid ${ink}55`, paddingTop: 14,
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          fontSize: 9, letterSpacing: 2.6, textTransform: 'uppercase',
          opacity: 0.7,
        }}>
          <span>{t.publisher}</span>
          <span>{t.spineYear}</span>
        </div>
      </div>
    </Cover>
  );
};

// =================================================================
// Variant 4 — STOISK / NEGATIVROM
// Almost defiantly austere. Tiny title in lower-right, single rule.
// =================================================================
const V4 = ({ t }) => {
  const bg = '#f5f1e7', ink = '#191713', accent = t.accentColor;
  return (
    <Cover bg={bg} ink={ink} accent={accent} t={t} showCropMarks={t.showCropMarks} showTrim={t.showTrim}>
      <BackPanel ink={ink} accent={accent} t={t} />
      <SpinePanel ink={ink} accent={accent} t={t} />
      <div style={{
        padding: '56px 56px 56px',
        display: 'flex', flexDirection: 'column',
        color: ink, position: 'relative',
      }}>
        <div style={{
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          fontSize: 9, letterSpacing: 2.6, textTransform: 'uppercase', opacity: 0.7,
        }}>{t.publisher}</div>
        <div style={{ flex: 1 }} />
        {/* a single thin rule */}
        <div style={{ height: 1, background: ink, opacity: 0.85, marginBottom: 24 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            fontSize: 10, letterSpacing: 2.6, textTransform: 'uppercase',
            opacity: 0.85,
          }}>
            {t.author}
          </div>
          <div style={{
            fontSize: 26, fontWeight: 500, letterSpacing: 0,
            color: ink,
          }}>
            <span>{t.title}</span>
            <span style={{ color: accent }}>.</span>
          </div>
        </div>
      </div>
    </Cover>
  );
};

// =================================================================
// Variant 5 — TYPOGRAFISK SKALA
// Title huge, hugging margins. Author small above. One restrained rule.
// =================================================================
const V5 = ({ t }) => {
  const bg = '#ece4d3', ink = '#1a1815', accent = t.accentColor;
  // Adjust title font-size to width-fit; for 'Basaliteter' (11 chars) at ~360px
  // width we land near 90px. Author scales similarly small.
  return (
    <Cover bg={bg} ink={ink} accent={accent} t={t} showCropMarks={t.showCropMarks} showTrim={t.showTrim}>
      <BackV5 ink={ink} t={t} />
      <SpinePanel ink={ink} accent={accent} t={t} />
      <div style={{
        padding: '64px 38px 56px',
        display: 'flex', flexDirection: 'column', color: ink,
        position: 'relative',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          fontSize: 10, letterSpacing: 2.6, textTransform: 'uppercase', opacity: 0.78,
        }}>
          <span>Kjetil Grunnvoll</span>
          <span>Dikt {t.spineYear}</span>
        </div>
        <div style={{ height: 14 }} />
        <div style={{ height: 0.5, background: ink, opacity: 0.85 }} />
        <div style={{ flex: 1 }} />
        <div style={{
          fontSize: 92, lineHeight: 0.95, fontWeight: 500,
          letterSpacing: -2.5,
          marginLeft: -2,
        }}>{t.title}</div>
        <div style={{ height: 32 }} />
        <div style={{ height: 0.5, background: ink, opacity: 0.85 }} />
        <div style={{ height: 10 }} />
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          fontSize: 10, letterSpacing: 2.6, textTransform: 'uppercase', opacity: 0.78,
        }}>
          <span>{t.publisher}</span>
          <span style={{ color: accent, letterSpacing: 4 }}>·</span>
        </div>
      </div>
    </Cover>
  );
};

// ---- App shell ---------------------------------------------------
const ACCENT_OPTIONS = [
  '#b48a3c', // oxidized ochre (default)
  '#7a2f25', // oxblood
  '#284a3b', // forest
  '#1f3a5a', // deep prussian
  '#1a1815', // pure ink (no accent)
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  return (
    <>
      <DesignCanvas>
        <DCSection
          id="wraparound"
          title="Basaliteter — bokomslag"
          subtitle="Innbundet, 135×210 mm · full omslagsutbrett (bak · rygg · forside) · 5 varianter"
        >
          <DCArtboard id="v1" label="V1 · Klassisk" width={COVER_W} height={COVER_H}>
            <V1 t={t} />
          </DCArtboard>
          <DCArtboard id="v2" label="V2 · Modernist band" width={COVER_W} height={COVER_H}>
            <V2 t={t} />
          </DCArtboard>
          <DCArtboard id="v3" label="V3 · Dyp natt" width={COVER_W} height={COVER_H}>
            <V3 t={t} />
          </DCArtboard>
          <DCArtboard id="v4" label="V4 · Stoisk negativrom" width={COVER_W} height={COVER_H}>
            <V4 t={t} />
          </DCArtboard>
          <DCArtboard id="v5" label="V5 · Typografisk skala" width={COVER_W} height={COVER_H}>
            <V5 t={t} />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Tekst">
          <TweakText label="Tittel" value={t.title}
            onChange={(v) => setTweak('title', v)} />
          <TweakText label="Forfatter" value={t.author}
            onChange={(v) => setTweak('author', v)} />
          <TweakText label="Forlag" value={t.publisher}
            onChange={(v) => setTweak('publisher', v)} />
          <TweakText label="År (rygg)" value={t.spineYear}
            onChange={(v) => setTweak('spineYear', v)} />
        </TweakSection>
        <TweakSection label="Aksent">
          <TweakColor
            label="Aksent"
            value={t.accentColor}
            options={ACCENT_OPTIONS}
            onChange={(v) => setTweak('accentColor', v)}
          />
        </TweakSection>
        <TweakSection label="Trykk-merker">
          <TweakToggle label="Beskjæringsmerker" value={t.showCropMarks}
            onChange={(v) => setTweak('showCropMarks', v)} />
          <TweakToggle label="Vis fals (rygg-grenser)" value={t.showTrim}
            onChange={(v) => setTweak('showTrim', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
