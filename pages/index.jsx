import { useState, useEffect, useRef } from "react";
import Head from "next/head";

const KONA_BLUE = "#77AFE0";
const KONA_DARK = "#1a1a2e";
const KONA_LIGHT = "#f8f9fc";

function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const visible = useInView(ref);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Nav() {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(248,249,252,0.92)", backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(0,0,0,0.06)",
      padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/kona_hero.png" alt="Kona" style={{ width: 34, height: 34, objectFit: "contain" }} />
        <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 20, color: KONA_DARK }}>
          meet<span style={{ color: KONA_BLUE }}>kona</span>
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <a href="https://withkona.com" style={{ fontSize: 14, color: "#666", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>
          Already have Kona? Sign in
        </a>
        <a href="https://chromewebstore.google.com/detail/kona-cashback-coupons/hllolafbiconfkgafojilkoiecmhgldg" style={{
          background: KONA_BLUE, color: "white", border: "none", borderRadius: 8,
          padding: "8px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", textDecoration: "none",
        }}>
          Add to Chrome
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  const [treats, setTreats] = useState([]);
  const [isJumping, setIsJumping] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const treatEmojis = ["🦴", "🍖", "🥩", "🍗", "🧁", "🍪", "🎾"];

  const dropTreats = () => {
    setIsJumping(true);
    setClickCount(c => c + 1);
    const newTreats = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      emoji: treatEmojis[Math.floor(Math.random() * treatEmojis.length)],
      left: Math.random() * 80 + 10,
      delay: Math.random() * 0.6,
      duration: 1.5 + Math.random() * 1,
      size: 20 + Math.random() * 16,
      rotate: Math.random() * 360,
      swing: (Math.random() - 0.5) * 40,
    }));
    setTreats(prev => [...prev, ...newTreats]);
    setTimeout(() => setIsJumping(false), 600);
    setTimeout(() => {
      setTreats(prev => prev.filter(t => !newTreats.find(nt => nt.id === t.id)));
    }, 3000);
  };

  return (
    <section style={{
      padding: "80px 24px 60px", textAlign: "center",
      background: `linear-gradient(180deg, ${KONA_LIGHT} 0%, white 100%)`,
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @keyframes konaFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-6px) rotate(1.5deg); }
          50% { transform: translateY(-3px) rotate(0deg); }
          75% { transform: translateY(-8px) rotate(-1.5deg); }
        }
        @keyframes konaJump {
          0% { transform: translateY(0) scale(1); }
          20% { transform: translateY(8px) scale(0.95, 1.05); }
          50% { transform: translateY(-40px) scale(1.05, 0.95); }
          70% { transform: translateY(-20px) scale(1); }
          85% { transform: translateY(4px) scale(0.98, 1.02); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes treatFall {
          0% { transform: translateY(-60px) rotate(var(--rot)) translateX(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateY(calc(100vh - 100px)) rotate(calc(var(--rot) + 360deg)) translateX(var(--swing)); opacity: 0; }
        }
        @keyframes shadowPulse {
          0%, 100% { transform: scale(1); opacity: 0.08; }
          25% { transform: scale(1.05); opacity: 0.06; }
          50% { transform: scale(1.02); opacity: 0.07; }
          75% { transform: scale(0.95); opacity: 0.09; }
        }
        @keyframes shadowJump {
          0% { transform: scale(1); opacity: 0.08; }
          20% { transform: scale(1.1); opacity: 0.1; }
          50% { transform: scale(0.4); opacity: 0.03; }
          70% { transform: scale(0.7); opacity: 0.05; }
          85% { transform: scale(1.05); opacity: 0.09; }
          100% { transform: scale(1); opacity: 0.08; }
        }
        .kona-hero-img {
          animation: konaFloat 4s ease-in-out infinite;
          cursor: pointer;
          transition: filter 0.2s;
        }
        .kona-hero-img:hover {
          filter: drop-shadow(0 8px 24px rgba(119,175,224,0.4)) brightness(1.03);
        }
        .kona-hero-img.jumping {
          animation: konaJump 0.6s ease-out forwards;
        }
        .kona-shadow {
          animation: shadowPulse 4s ease-in-out infinite;
        }
        .kona-shadow.jumping {
          animation: shadowJump 0.6s ease-out forwards;
        }
      `}</style>

      <div style={{
        position: "absolute", top: -120, right: -120, width: 400, height: 400,
        borderRadius: "50%", background: `${KONA_BLUE}10`,
      }} />
      <div style={{
        position: "absolute", bottom: -80, left: -80, width: 300, height: 300,
        borderRadius: "50%", background: `${KONA_BLUE}08`,
      }} />

      {treats.map(t => (
        <div key={t.id} style={{
          position: "absolute", top: 0, left: `${t.left}%`,
          fontSize: t.size, zIndex: 50, pointerEvents: "none",
          animation: `treatFall ${t.duration}s ease-in ${t.delay}s forwards`,
          opacity: 0,
          "--rot": `${t.rotate}deg`, "--swing": `${t.swing}px`,
        }}>
          {t.emoji}
        </div>
      ))}

      <FadeIn>
        <div style={{ position: "relative", display: "inline-block", cursor: "pointer" }} onClick={dropTreats}>
          <img
            src="/kona_hero.png"
            alt="Kona the dog - click me for treats!"
            className={`kona-hero-img${isJumping ? " jumping" : ""}`}
            style={{
              width: 180, height: 180, objectFit: "contain",
              display: "block", margin: "0 auto",
              filter: "drop-shadow(0 4px 16px rgba(119,175,224,0.25))",
            }}
          />
          <div
            className={`kona-shadow${isJumping ? " jumping" : ""}`}
            style={{
              width: 100, height: 16, borderRadius: "50%",
              background: "rgba(0,0,0,0.08)", margin: "8px auto 0",
              filter: "blur(4px)",
            }}
          />
          {clickCount === 0 && (
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#bbb",
              margin: "8px 0 0", fontStyle: "italic",
            }}>
              psst... click me
            </p>
          )}
          {clickCount > 0 && clickCount < 3 && (
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: KONA_BLUE,
              margin: "8px 0 0", fontWeight: 600,
            }}>
              {clickCount === 1 ? "Good girl! Again!" : "Woof! More treats!"}
            </p>
          )}
          {clickCount >= 3 && (
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: KONA_BLUE,
              margin: "8px 0 0", fontWeight: 600,
            }}>
              {["Best. Day. Ever.", "I love you already.", "Can I keep you?", "You're my favorite human."][clickCount % 4]}
            </p>
          )}
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p style={{
          fontFamily: "'Nunito', sans-serif", fontSize: 36, fontWeight: 800,
          color: KONA_BLUE, margin: "16px 0 16px", letterSpacing: 0.5,
        }}>
          Hi! I'm Kona.
        </p>
      </FadeIn>
      <FadeIn delay={0.2}>
        <h1 style={{
          fontFamily: "'Nunito', sans-serif", fontSize: "clamp(22px, 3.5vw, 32px)",
          fontWeight: 700, color: KONA_DARK, margin: "0 0 16px",
          lineHeight: 1.15, maxWidth: 680, marginLeft: "auto", marginRight: "auto",
        }}>
          I'm your AI shopping assistant that also earns you cashback.
        </h1>
      </FadeIn>
      <FadeIn delay={0.3}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: "#666",
          maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.6,
        }}>
          I live in your browser and help you decide what to buy, find the best price, and earn real cash back on every purchase. No tricks, only treats.
        </p>
      </FadeIn>
      <FadeIn delay={0.4}>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://chromewebstore.google.com/detail/kona-cashback-coupons/hllolafbiconfkgafojilkoiecmhgldg" style={{
            background: KONA_BLUE, color: "white", border: "none", borderRadius: 10,
            padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", textDecoration: "none", display: "inline-block",
          }}>
            Add Kona to Chrome - it's free
          </a>
          <a href="#how-it-works" style={{
            background: "white", color: KONA_DARK, border: "1.5px solid #ddd", borderRadius: 10,
            padding: "14px 28px", fontSize: 16, fontWeight: 600, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", textDecoration: "none", display: "inline-block",
          }}>
            See how it works
          </a>
        </div>
      </FadeIn>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "1", title: "Add me to Chrome", desc: "One click, totally free. I'll sit quietly in your browser until you need me.", color: "#E6F1FB", accent: "#185FA5" },
    { num: "2", title: "Shop like normal", desc: "When you visit a store I know, I'll pop up and let you know there's cashback available.", color: "#E1F5EE", accent: "#0F6E56" },
    { num: "3", title: "Ask me anything", desc: "Not sure if something's worth it? Ask me. I'll research reviews, compare prices, and give you the honest answer.", color: "#FAEEDA", accent: "#854F0B" },
    { num: "4", title: "Get paid your way", desc: "Withdraw your cashback anytime via PayPal, Venmo, USDC, or 2,500+ gift cards. Your money, your call.", color: "#FBEAF0", accent: "#993556" },
  ];

  return (
    <section id="how-it-works" style={{ padding: "80px 24px", background: "white" }}>
      <FadeIn>
        <h2 style={{
          fontFamily: "'Nunito', sans-serif", fontSize: 32, fontWeight: 800,
          color: KONA_DARK, textAlign: "center", margin: "0 0 12px",
        }}>
          Here's how I work
        </h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#888",
          textAlign: "center", margin: "0 0 48px",
        }}>
          Four paws, four steps. Pretty simple, honestly.
        </p>
      </FadeIn>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 20, maxWidth: 960, margin: "0 auto",
      }}>
        {steps.map((s, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div style={{
              background: KONA_LIGHT, borderRadius: 16, padding: "28px 24px",
              border: "1px solid rgba(0,0,0,0.04)", height: "100%",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: s.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 800, color: s.accent, marginBottom: 16,
                fontFamily: "'Nunito', sans-serif",
              }}>{s.num}</div>
              <h3 style={{
                fontFamily: "'Nunito', sans-serif", fontSize: 18, fontWeight: 700,
                color: KONA_DARK, margin: "0 0 8px",
              }}>{s.title}</h3>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#777",
                margin: 0, lineHeight: 1.6,
              }}>{s.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function AISection() {
  const features = [
    { title: "Product deep dives", desc: "Ask me about any product and I'll research reviews, ratings, and what real buyers think." },
    { title: "Price comparison", desc: "I'll check across retailers so you know you're getting the best deal before you buy." },
    { title: "Total transparency", desc: "Stores pay me a commission when you buy. I split that with you as cashback. That's the whole business model." },
    { title: "Cashback stacking", desc: "I'll find the best combination of coupons and cashback so you save the most." },
  ];

  return (
    <section style={{ padding: "80px 24px", background: KONA_LIGHT }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <FadeIn>
          <div style={{
            display: "inline-block", background: `${KONA_BLUE}15`, color: KONA_BLUE,
            fontSize: 13, fontWeight: 700, padding: "6px 14px", borderRadius: 20,
            fontFamily: "'DM Sans', sans-serif", marginBottom: 16,
          }}>
            AI-powered
          </div>
          <h2 style={{
            fontFamily: "'Nunito', sans-serif", fontSize: 32, fontWeight: 800,
            color: KONA_DARK, margin: "0 0 12px",
          }}>
            I'm not just a coupon finder.
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#888",
            margin: "0 0 40px", maxWidth: 560, lineHeight: 1.6,
          }}>
            Most cashback tools wait for you to check out and then try a code. I'm different. I help you decide what to buy in the first place.
          </p>
        </FadeIn>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}>
          {features.map((f, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div style={{
                background: "white", borderRadius: 14, padding: "24px 20px",
                border: "1px solid rgba(0,0,0,0.05)",
              }}>
                <h3 style={{
                  fontFamily: "'Nunito', sans-serif", fontSize: 16, fontWeight: 700,
                  color: KONA_DARK, margin: "0 0 8px",
                }}>{f.title}</h3>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888",
                  margin: 0, lineHeight: 1.6,
                }}>{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoSection() {
  return (
    <section style={{ padding: "80px 24px", background: "white" }}>
      <FadeIn>
        <h2 style={{
          fontFamily: "'Nunito', sans-serif", fontSize: 32, fontWeight: 800,
          color: KONA_DARK, textAlign: "center", margin: "0 0 12px",
        }}>
          See me in action
        </h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#888",
          textAlign: "center", margin: "0 0 40px",
        }}>
          30 seconds. That's all it takes to get it.
        </p>
      </FadeIn>
      <FadeIn delay={0.15}>
        <div style={{
          maxWidth: 720, margin: "0 auto", borderRadius: 16,
          background: KONA_DARK, aspectRatio: "16/9",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, ${KONA_BLUE}30 0%, transparent 60%)`,
          }} />
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: KONA_BLUE, display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1, boxShadow: `0 8px 32px ${KONA_BLUE}40`,
          }}>
            <div style={{
              width: 0, height: 0,
              borderTop: "14px solid transparent", borderBottom: "14px solid transparent",
              borderLeft: "22px solid white", marginLeft: 4,
            }} />
          </div>
          <p style={{
            position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center",
            color: "rgba(255,255,255,0.5)", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            margin: 0,
          }}>Video coming soon</p>
        </div>
      </FadeIn>
    </section>
  );
}

function ComparisonTable() {
  const rows = [
    { feature: "Real cash payouts", kona: "Yes", honey: "Points only", rakuten: "Yes" },
    { feature: "Withdraw anytime", kona: "Yes", honey: "$10 minimum", rakuten: "Quarterly only" },
    { feature: "AI shopping advisor", kona: "Yes", honey: "No", rakuten: "No" },
    { feature: "Crypto payouts (USDC)", kona: "Yes", honey: "No", rakuten: "No" },
    { feature: "Transparent rates", kona: "Yes", honey: "Hidden", rakuten: "Yes" },
  ];

  const isPositive = (v) => v === "Yes";

  return (
    <section style={{ padding: "80px 24px", background: KONA_LIGHT }}>
      <FadeIn>
        <h2 style={{
          fontFamily: "'Nunito', sans-serif", fontSize: 32, fontWeight: 800,
          color: KONA_DARK, textAlign: "center", margin: "0 0 12px",
        }}>
          How I compare
        </h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#888",
          textAlign: "center", margin: "0 0 40px",
        }}>
          Not all cashback tools are created equal. Here's the honest breakdown.
        </p>
      </FadeIn>
      <FadeIn delay={0.15}>
        <div style={{
          maxWidth: 720, margin: "0 auto", background: "white",
          borderRadius: 16, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', sans-serif" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "#999" }}></th>
                <th style={{ textAlign: "center", padding: "14px 16px", fontSize: 14, fontWeight: 700, color: KONA_BLUE }}>Kona</th>
                <th style={{ textAlign: "center", padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#999" }}>Honey</th>
                <th style={{ textAlign: "center", padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#999" }}>Rakuten</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                  <td style={{ padding: "12px 20px", fontSize: 14, color: "#555" }}>{r.feature}</td>
                  <td style={{ textAlign: "center", padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#0F6E56" }}>{r.kona}</td>
                  <td style={{
                    textAlign: "center", padding: "12px 16px", fontSize: 13,
                    color: isPositive(r.honey) ? "#0F6E56" : "#999",
                  }}>{r.honey}</td>
                  <td style={{
                    textAlign: "center", padding: "12px 16px", fontSize: 13,
                    color: isPositive(r.rakuten) ? "#0F6E56" : "#999",
                  }}>{r.rakuten}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeIn>
    </section>
  );
}

function TrustCards() {
  const cards = [
    { title: "Real cash, not points", desc: "Get paid in actual money. PayPal, Venmo, USDC, or 2,500+ gift cards. Your choice." },
    { title: "Your info stays safe", desc: "All payout data is AES-256 encrypted. Email verification required for new payment methods. We never have direct access to your accounts." },
    { title: "Transparent payouts", desc: "Stores pay me a commission when you shop. I split it with you as cashback. That's the whole model, no hidden anything." },
    { title: "Withdraw on your schedule", desc: "No quarterly payouts, no $10 minimums. Your money, whenever you want it." },
  ];

  return (
    <section style={{ padding: "80px 24px", background: "white" }}>
      <FadeIn>
        <h2 style={{
          fontFamily: "'Nunito', sans-serif", fontSize: 32, fontWeight: 800,
          color: KONA_DARK, textAlign: "center", margin: "0 0 40px",
        }}>
          Why people trust me
        </h2>
      </FadeIn>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16, maxWidth: 960, margin: "0 auto",
      }}>
        {cards.map((c, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div style={{
              background: KONA_LIGHT, borderRadius: 14, padding: "24px 20px",
              border: "1px solid rgba(0,0,0,0.04)",
            }}>
              <h3 style={{
                fontFamily: "'Nunito', sans-serif", fontSize: 16, fontWeight: 700,
                color: KONA_DARK, margin: "0 0 8px",
              }}>{c.title}</h3>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888",
                margin: 0, lineHeight: 1.6,
              }}>{c.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  const items = [
    { q: "Is Kona really free?", a: "Yep! Stores pay me a small commission when you shop through my links. I share that commission with you as cashback. You never pay a cent." },
    { q: "How is Kona different from Honey?", a: "Honey gives you points. I give you real cash. Honey tries coupon codes at checkout. I help you research products, compare prices, and decide if something is worth buying before you even get to checkout. Different approach entirely." },
    { q: "What stores work with Kona?", a: "I work with 30+ stores right now and growing fast. NordVPN, Expedia, TikTok Shop, Groupon, Surfshark, Zappos, and more. New stores get added every week." },
    { q: "How do I get paid?", a: "You pick your payout method: PayPal, Venmo, USDC crypto, or gift cards from 2,500+ brands. Withdraw whenever you want, no minimums." },
    { q: "Does Kona sell my data?", a: "No. I don't sell your browsing data, shopping history, or personal information. Ever. Your privacy policy is right on the site if you want to read it." },
    { q: "What's the AI part?", a: "I'm powered by AI, which means you can literally ask me questions about products. 'Is this laptop worth it?' 'What's the best VPN deal right now?' I'll research it and give you an honest answer, plus let you know if there's cashback available." },
  ];

  return (
    <section style={{ padding: "80px 24px", background: KONA_LIGHT }}>
      <FadeIn>
        <h2 style={{
          fontFamily: "'Nunito', sans-serif", fontSize: 32, fontWeight: 800,
          color: KONA_DARK, textAlign: "center", margin: "0 0 40px",
        }}>
          Questions? I've got answers.
        </h2>
      </FadeIn>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {items.map((item, i) => (
          <FadeIn key={i} delay={i * 0.05}>
            <div
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                background: "white", borderRadius: 12, marginBottom: 8,
                border: "1px solid rgba(0,0,0,0.05)", cursor: "pointer",
                overflow: "hidden",
              }}
            >
              <div style={{
                padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <p style={{
                  fontFamily: "'Nunito', sans-serif", fontSize: 15, fontWeight: 700,
                  color: KONA_DARK, margin: 0,
                }}>{item.q}</p>
                <span style={{
                  fontSize: 20, color: "#ccc", transition: "transform 0.3s",
                  transform: open === i ? "rotate(45deg)" : "rotate(0)",
                  flexShrink: 0, marginLeft: 12,
                }}>+</span>
              </div>
              {open === i && (
                <div style={{ padding: "0 20px 16px" }}>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#777",
                    margin: 0, lineHeight: 1.7,
                  }}>{item.a}</p>
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section style={{
      padding: "80px 24px", textAlign: "center",
      background: `linear-gradient(135deg, ${KONA_DARK} 0%, #2a2a4a 100%)`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -100, right: -100, width: 350, height: 350,
        borderRadius: "50%", background: `${KONA_BLUE}12`,
      }} />
      <FadeIn>
        <p style={{
          fontFamily: "'Nunito', sans-serif", fontSize: 18, fontWeight: 700,
          color: KONA_BLUE, margin: "0 0 8px",
        }}>
          Ready to save some treats?
        </p>
        <h2 style={{
          fontFamily: "'Nunito', sans-serif", fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 800, color: "white", margin: "0 0 16px", lineHeight: 1.2,
        }}>
          Add Kona to Chrome and start earning cashback today.
        </h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.55)",
          margin: "0 0 32px", maxWidth: 480, marginLeft: "auto", marginRight: "auto",
        }}>
          It takes 5 seconds to install. No signup required to start browsing. I'll be right there whenever you need me.
        </p>
        <a href="https://chromewebstore.google.com/detail/kona-cashback-coupons/hllolafbiconfkgafojilkoiecmhgldg" style={{
          background: KONA_BLUE, color: "white", border: "none", borderRadius: 10,
          padding: "16px 40px", fontSize: 17, fontWeight: 700, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", boxShadow: `0 8px 32px ${KONA_BLUE}40`,
          textDecoration: "none", display: "inline-block",
        }}>
          Add Kona to Chrome - it's free
        </a>
      </FadeIn>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      padding: "40px 24px", background: KONA_DARK,
      borderTop: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{
        maxWidth: 960, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/kona_hero.png" alt="Kona" style={{ width: 28, height: 28, objectFit: "contain" }} />
          <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 15, color: "rgba(255,255,255,0.6)" }}>
            Kona
          </span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <a href="https://withkona.com" style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>withkona.com</a>
          <a href="https://withkona.com/extension-privacy" style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>Privacy</a>
        </div>
      </div>
    </footer>
  );
}

export default function MeetKona() {
  return (
    <>
      <Head>
        <title>Meet Kona - Your AI Shopping Assistant with Cashback</title>
        <meta name="description" content="Kona is your AI-powered shopping assistant that helps you decide what to buy, finds the best price, and earns you real cashback. Free Chrome extension." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta property="og:title" content="Meet Kona - Your AI Shopping Assistant" />
        <meta property="og:description" content="I help you decide what to buy, find the best price, and earn real cashback. No tricks, only treats." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://meetkona.com" />
      </Head>
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: white; -webkit-font-smoothing: antialiased; }
      `}</style>
      <div style={{ minHeight: "100vh" }}>
        <Nav />
        <Hero />
        <HowItWorks />
        <AISection />
        <VideoSection />
        <ComparisonTable />
        <TrustCards />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}
