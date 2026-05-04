import { useState, useEffect, useRef } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

// ─── FONT ─────────────────────────────────────────────────────────────────────
if (typeof document !== "undefined" && !document.getElementById("sg-inter")) {
  const l = document.createElement("link");
  l.id = "sg-inter"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap";
  document.head.appendChild(l);
}
const F = "'Inter', system-ui, -apple-system, sans-serif";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
// Single accent (Cinnabar) + semantic colours only. No decorative gradients.
const C = {
  // Brand accent
  accent:       "#F04E23",
  accentHover:  "#C44220",
  accentTint:   "#FDE8E3",
  accentBorder: "#F8C4B5",
  // Neutrals
  black:        "#2E2B27",
  textPrimary:  "#1A1917",
  textBody:     "#374151",
  textMuted:    "#6B7280",
  textFaint:    "#9CA3AF",
  // Surfaces
  bg:           "#F7F6F5",
  surface:      "#FFFFFF",
  surfaceAlt:   "#FAFAF9",
  // Borders
  border:       "#E5E3E0",
  borderMid:    "#D1CEC9",
  // Semantic
  success:      "#16A34A",
  successBg:    "#F0FDF4",
  destructive:  "#DC2626",
  destructiveBg:"#FEF2F2",
  destructiveBorder: "#FECACA",
  warning:      "#92400E",
  warningBg:    "#FFFBEB",
  warningBorder:"#FDE68A",
  disabled:     "#D1D5DB",
};

// ─── MARKETING COMPETENCIES ───────────────────────────────────────────────────
// 6 themes, each with 1 sub-dimension assessed at IC2–IC5.
// Colour ramp: accent + 5 tonal variants, all distinct and readable.
const THEMES = [
  {
    id: "mkt_strategy",
    name: "Strategy",
    fullName: "Marketing Strategy & Business Integration",
    color: "#F04E23",
    lightColor: "#FDE8E3",
    subdimensions: [{
      id: "mkt_strategy_sd",
      name: "Marketing strategy & business integration",
      statements: {
        IC2: {
          text: "I understand the product value proposition and ICP, execute predefined GTM plans, contribute research insights, and am learning SaaS metrics such as CAC, LTV, and funnel stages.",
          example: "I execute the campaign plan my team has defined, contribute desk research, and can explain what CAC and LTV mean when asked.",
        },
        IC3: {
          text: "I contribute structured input to GTM planning, map segments and buyer journeys, align messaging with releases, and own smaller GTM initiatives end-to-end. I demonstrate working knowledge of CAC/LTV and revenue motions and maintain lightweight competitive tracking.",
          example: "I led a product feature launch from messaging through landing page to measurement, documented assumptions and shared learnings with the team.",
        },
        IC4: {
          text: "I design end-to-end GTM strategies for product and feature rollouts, connect initiatives explicitly to revenue outcomes, prioritise based on ROI and opportunity size, and own the positioning narrative within my domain. I align cross-functional stakeholders through clear documentation.",
          example: "I built the GTM strategy for a new pricing tier, including segmentation, messaging, channel mix, and success metrics tied directly to revenue payback.",
        },
        IC5: {
          text: "I create and own strategic GTM playbooks across regions, advise executives on market-entry decisions, align brand, product, and revenue strategies, and lead cross-functional strategy rituals and OKRs. I shape and scale PLG- and/or SLG-driven acquisition and retention frameworks and oversee marketing budgets.",
          example: "I own the multi-region GTM playbook and lead the quarterly strategy review with the exec team, connecting all marketing investment to business-level revenue outcomes.",
        },
      },
    }],
  },
  {
    id: "mkt_demand",
    name: "Lead Gen",
    fullName: "Lead Generation & Funnel Optimisation",
    color: "#D95B6F",
    lightColor: "#FAEAED",
    subdimensions: [{
      id: "mkt_demand_sd",
      name: "Lead generation & funnel optimisation",
      statements: {
        IC2: {
          text: "I execute campaigns using playbooks, track core funnel metrics such as CVR and MQLs, learn qualification logic, and assist with lead list building and outreach.",
          example: "I set up and ran a campaign following our standard playbook, tracked MQL volume in our dashboard, and helped build a prospect list for outreach.",
        },
        IC3: {
          text: "I design channel-level lead capture strategies with documented hypotheses, run structured experiments with defined success criteria, improve funnel stages using directional data, and share experiment learnings with the broader marketing team.",
          example: "I ran a 4-week landing page test with a clear hypothesis, measured the CVR impact, and wrote up the findings in our shared learnings doc.",
        },
        IC4: {
          text: "I own pipeline targets for a segment or product, forecast impact, design multi-channel experimentation roadmaps tied to business goals, optimise CAC, CVR, and activation metrics, and stop or rework underperforming funnel components decisively.",
          example: "I own the MQL-to-SQL conversion target for our mid-market segment and run a quarterly roadmap of experiments to hit it, working closely with Sales and RevOps.",
        },
        IC5: {
          text: "I set pipeline generation targets for the marketing org, design full-funnel experimentation frameworks used across teams, integrate product usage and behavioural signals into qualification logic, and partner with leadership on growth forecasting and scenario modelling.",
          example: "I defined the org-wide pipeline generation targets, built the experimentation framework that other teams now use, and present growth scenarios to the exec team quarterly.",
        },
      },
    }],
  },
  {
    id: "mkt_channels",
    name: "Channels",
    fullName: "Acquisition & Growth Channels",
    color: "#B57DC8",
    lightColor: "#F3EAF8",
    subdimensions: [{
      id: "mkt_channels_sd",
      name: "Acquisition & growth channels",
      statements: {
        IC2: {
          text: "I support campaign setup and KPI tracking and understand channel economics such as CPC, CTR, and CVR.",
          example: "I set up campaigns in our ad platform following the brief, tracked performance against our KPI targets, and flagged anomalies to my lead.",
        },
        IC3: {
          text: "I own execution of specific channels with clear budget awareness, track CAC, payback, and ROAS and explain performance trade-offs, test creatives and targeting systematically, and document channel insights and share patterns across brands.",
          example: "I own our paid search channel, hit our CAC targets within budget, and regularly share performance insights and creative test outcomes with the team.",
        },
        IC4: {
          text: "I develop cross-channel acquisition strategy tied to marginal return logic, own budget forecasting and scaling decisions, evaluate diminishing returns and reallocate capital accordingly, and manage agencies and partners with performance accountability.",
          example: "I built our cross-channel acquisition strategy, made the call to cut underperforming display spend and reallocate it to paid social, and manage our agency with clear performance SLAs.",
        },
        IC5: {
          text: "I define long-term growth investment strategy at brand or portfolio level, partner with leadership on profitability and capital allocation modelling, establish experimentation and funding standards for acquisition, and guide when to scale, hold, or exit channels based on portfolio logic.",
          example: "I define which channels we invest in across the portfolio, present capital allocation recommendations to leadership, and set the standards other teams use for channel experimentation.",
        },
      },
    }],
  },
  {
    id: "mkt_content",
    name: "Content & SEO",
    fullName: "Content, SEO & Demand Engine",
    color: "#7B6FCC",
    lightColor: "#EDEAFC",
    subdimensions: [{
      id: "mkt_content_sd",
      name: "Content, SEO & demand engine",
      statements: {
        IC2: {
          text: "I produce optimised content using briefs and AI assistance, apply SEO guidelines, and conduct keyword research.",
          example: "I write blog posts from provided briefs, apply on-page SEO guidelines, and conduct keyword research using our standard tools.",
        },
        IC3: {
          text: "I own content for a persona or funnel stage and maintain an editorial roadmap, document messaging pillars, conduct SEO/AEO audits, track organic performance and AI visibility trends, and repurpose and distribute content intentionally.",
          example: "I own the mid-funnel content programme, maintain our editorial calendar, run quarterly SEO audits, and track our AI-search visibility alongside organic rankings.",
        },
        IC4: {
          text: "I design long-term content and organic growth strategy aligned to demand and product, build scalable content systems covering briefing, review, distribution, and refresh cycles, connect content performance to pipeline impact, and ensure AI-assisted content meets brand, factual, and quality standards.",
          example: "I built our content operations system — brief templates, review workflows, distribution process — and established the quality bar for AI-assisted content across the team.",
        },
        IC5: {
          text: "I define brand messaging architecture and narrative authority, establish a scalable content engine across brands and channels, own SEO/AEO targets and authority-building roadmap, shape category positioning through thought leadership, and set quality standards for AI-assisted content portfolio-wide.",
          example: "I own the messaging architecture across our brand portfolio, set the group-wide SEO/AEO targets, and define the editorial standards that all brands follow for AI-assisted content.",
        },
      },
    }],
  },
  {
    id: "mkt_analytics",
    name: "Analytics",
    fullName: "Analytics, Attribution & SaaS Metrics",
    color: "#B8495F",
    lightColor: "#F7E0E4",
    subdimensions: [{
      id: "mkt_analytics_sd",
      name: "Analytics, attribution & SaaS metrics",
      statements: {
        IC2: {
          text: "I build basic reports, understand CAC, LTV, MQL, and SQL definitions, and am learning attribution basics.",
          example: "I pull standard performance reports from our analytics tool and can explain what CAC, LTV, and MQL mean when asked.",
        },
        IC3: {
          text: "I build structured dashboards and explain key drivers rather than just numbers, analyse CAC/LTV by segment, communicate insights clearly in async updates, use proxy metrics confidently when attribution is incomplete, and flag data inconsistencies proactively.",
          example: "I built our channel performance dashboard with clear driver commentary, identified a CAC deterioration by segment before anyone else noticed, and documented why attribution was incomplete in that period.",
        },
        IC4: {
          text: "I develop performance frameworks across channels and lifecycle stages, connect marketing, product, and sales data into coherent narratives, lead reporting rituals with clear recommendations rather than raw data, improve tracking quality and attribution clarity over time, and make data-backed prioritisation decisions with documented trade-offs.",
          example: "I run our weekly marketing review with clear recommendations, not raw numbers, and I led the project to fix our attribution gaps so we now have reliable CAC by channel.",
        },
        IC5: {
          text: "I define metrics taxonomy and analytics standards across teams, lead growth modelling and scenario planning covering LTV, payback, and marginal ROI, guide investment decisions using structured financial logic, elevate data literacy across teams, and ensure clean, reliable, privacy-compliant data operations.",
          example: "I defined the metrics taxonomy the whole marketing org uses, run monthly growth modelling for exec-level investment decisions, and led the data privacy remediation that brought our tracking into compliance.",
        },
      },
    }],
  },
  {
    id: "mkt_ops",
    name: "Automation & Ops",
    fullName: "Marketing Automation, AI & Operations",
    color: "#5E7CC4",
    lightColor: "#E8EEFC",
    subdimensions: [{
      id: "mkt_ops_sd",
      name: "Marketing automation, AI & operations",
      statements: {
        IC2: {
          text: "I use CRM/CMS tools, apply AI for assistance with drafting, research, and summaries, and understand workflow basics.",
          example: "I use HubSpot for day-to-day tasks, use AI to speed up first drafts and research, and follow our standard workflow documentation.",
        },
        IC3: {
          text: "I design multi-step automation workflows and document logic clearly, use AI to improve speed, quality, and research depth rather than to shortcut thinking, integrate tools via APIs and automation platforms, maintain roadmap visibility and operational hygiene, and share useful AI workflows with the team.",
          example: "I built a lead nurture workflow with branching logic in HubSpot, integrated it with Slack for sales alerts via Zapier, and shared the AI prompt templates I use with the team.",
        },
        IC4: {
          text: "I design AI-assisted systems that reduce manual work and increase leverage, own lifecycle automation tied to user behaviour and product signals, maintain structured marketing roadmap and budget tracking, connect the marketing stack across CRM, analytics, and support tools, and train team members in tooling best practices and AI guardrails.",
          example: "I built an AI-assisted content QA system that cut review time by 60%, own the full lifecycle automation programme tied to product usage data, and run our quarterly tooling training sessions.",
        },
        IC5: {
          text: "I define marketing automation architecture and AI roadmap, implement scalable systems such as predictive scoring, intent modelling, and personalisation engines usable across the portfolio, standardise tooling decisions and operational frameworks, and drive AI adoption and capability uplift across marketing teams.",
          example: "I designed the automation and AI architecture across the marketing portfolio, implemented a predictive lead scoring model shared by multiple brands, and set the tooling standards other teams adopt.",
        },
      },
    }],
  },
];

const LEVELS = ["IC2", "IC3", "IC4", "IC5"];
const LEVEL_LABELS = { IC2: "Beginner", IC3: "Proficient", IC4: "Fully proficient", IC5: "Domain expert" };
const STORAGE_KEY = "sg_cf_marketing_v1";
const TOTAL_Q = THEMES.length; // 6

// ─── INTRO SCREEN ─────────────────────────────────────────────────────────────
function IntroScreen({ onStart }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const canStart = name.trim().length > 1 && email.includes("@");

  const inputStyle = (hasValue) => ({
    width: "100%",
    padding: "12px 14px",
    fontSize: 16,
    lineHeight: 1.5,
    borderRadius: 10,
    boxSizing: "border-box",
    border: "1.5px solid " + C.border,
    outline: "none",
    fontFamily: F,
    color: C.textPrimary,
    background: C.surface,
    transition: "border-color 150ms ease-out",
  });

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: F }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 20px 64px" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.accent, background: C.accentTint, padding: "4px 10px", borderRadius: 4, marginBottom: 20 }}>
            Career Framework · Marketing
          </span>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: C.textPrimary, lineHeight: 1.2, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Marketing competency self-assessment
          </h1>
          <p style={{ fontSize: 16, color: C.textMuted, margin: 0, lineHeight: 1.6 }}>
            {TOTAL_Q} questions &middot; ~8 minutes &middot; Marketing job family
          </p>
        </div>

        {/* About section */}
        <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 14, padding: "20px 24px", marginBottom: 24 }}>
          <p style={{ fontSize: 15, color: C.textBody, margin: "0 0 12px", lineHeight: 1.65 }}>
            Reflect on where you operate <strong>today</strong> across the 6 Marketing functional competencies. Choose the statement that best describes your consistent, everyday level — not your best day or an aspiration.
          </p>
          <p style={{ fontSize: 15, color: C.textBody, margin: 0, lineHeight: 1.65 }}>
            Each question includes a concrete example to help you recognise yourself in the description. Your results are shared with your manager to support your development conversation.
          </p>
        </div>

        {/* Registration */}
        <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 14, padding: "20px 24px", marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, margin: "0 0 20px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Before you begin
          </h2>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="name" style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: C.textBody, marginBottom: 6 }}>
              Full name <span style={{ color: C.accent }} aria-hidden="true">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Maria Santos"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
              style={inputStyle(name.length > 0)}
              onFocus={e => (e.target.style.borderColor = C.accent)}
              onBlur={e => (e.target.style.borderColor = C.border)}
            />
            <p style={{ fontSize: 12.5, color: C.textFaint, margin: "6px 0 0" }}>
              Appears on your results so your manager can identify the submission.
            </p>
          </div>

          <div>
            <label htmlFor="email" style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: C.textBody, marginBottom: 6 }}>
              Email address <span style={{ color: C.accent }} aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="e.g. maria@saas.group"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              inputMode="email"
              style={inputStyle(email.length > 0)}
              onFocus={e => (e.target.style.borderColor = C.accent)}
              onBlur={e => (e.target.style.borderColor = C.border)}
            />
            <p style={{ fontSize: 12.5, color: C.textFaint, margin: "6px 0 0" }}>
              You&apos;ll be reminded to CC yourself when sharing results with your manager.
            </p>
          </div>
        </div>

        {/* Tips */}
        <div style={{ background: C.surfaceAlt, border: "1px solid " + C.border, borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: C.textPrimary, margin: "0 0 8px" }}>Tips for honest self-assessment</p>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.75, color: C.textBody }}>
            <li style={{ marginBottom: 4 }}>Pick the level that describes your <em>consistent</em> operation, not a one-off peak.</li>
            <li style={{ marginBottom: 4 }}>It&apos;s normal to be at different levels across different competencies.</li>
            <li style={{ marginBottom: 4 }}>If you&apos;re between two levels, pick the lower one and note the gap for discussion.</li>
            <li>Your manager completes a parallel assessment &mdash; differences are useful starting points.</li>
          </ul>
        </div>

        <button
          onClick={() => canStart && onStart(name.trim(), email.trim())}
          disabled={!canStart}
          aria-disabled={!canStart}
          style={{
            width: "100%",
            padding: "15px 24px",
            fontSize: 16,
            fontWeight: 700,
            color: "#fff",
            background: canStart ? C.accent : C.disabled,
            border: "none",
            borderRadius: 12,
            cursor: canStart ? "pointer" : "not-allowed",
            fontFamily: F,
            transition: "background 150ms ease-out",
            minHeight: 52,
          }}
          onMouseEnter={e => { if (canStart) e.currentTarget.style.background = C.accentHover; }}
          onMouseLeave={e => { if (canStart) e.currentTarget.style.background = C.accent; }}
          onMouseDown={e => { if (canStart) e.currentTarget.style.transform = "scale(0.99)"; }}
          onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          Begin self-assessment
        </button>
        {!canStart && (
          <p role="status" style={{ textAlign: "center", fontSize: 13, color: C.textFaint, margin: "8px 0 0" }}>
            Enter your name and email to continue.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total, themeColor }) {
  const pct = Math.round(((current) / total) * 100);
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={"Question " + (current + 1) + " of " + total}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(247,246,245,0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid " + C.border,
        padding: "10px 20px",
        fontFamily: F,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 560, margin: "0 auto 6px" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: themeColor }}>
          Marketing competencies
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.textFaint }}>
          {current + 1} / {total}
        </span>
      </div>
      <div style={{ maxWidth: 560, margin: "0 auto", height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: pct + "%",
          background: themeColor,
          borderRadius: 2,
          transition: "width 450ms cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
}

// ─── QUESTION CARD ────────────────────────────────────────────────────────────
function QuestionCard({ theme, subdimension, selectedLevel, onSelect, onNext, onPrev, isFirst, isLast, questionNumber }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    const raf = requestAnimationFrame(() => {
      el.style.transition = "opacity 280ms ease-out, transform 280ms ease-out";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    return () => cancelAnimationFrame(raf);
  }, [subdimension.id]);

  return (
    <div ref={wrapRef} style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px 48px", fontFamily: F }}>

      {/* Theme label */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 12px", borderRadius: 20, background: theme.lightColor, marginBottom: 16 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: theme.color, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: theme.color }}>{theme.fullName}</span>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: "0 0 8px", lineHeight: 1.25, letterSpacing: "-0.01em" }}>
        {subdimension.name}
      </h2>
      <p style={{ fontSize: 14, color: C.textFaint, margin: "0 0 24px", lineHeight: 1.5 }}>
        Select the statement that best describes how you consistently operate.
      </p>

      {/* Options */}
      <div role="radiogroup" aria-label={subdimension.name} style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {LEVELS.map(level => {
          const item = subdimension.statements[level];
          const sel = selectedLevel === level;
          const text = typeof item === "object" ? item.text : item;
          const example = typeof item === "object" ? item.example : null;
          return (
            <button
              key={level}
              role="radio"
              aria-checked={sel}
              onClick={() => onSelect(level)}
              style={{
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                padding: "16px",
                borderRadius: 10,
                cursor: "pointer",
                border: sel ? "2px solid " + theme.color : "1.5px solid " + C.border,
                background: sel ? theme.lightColor : C.surface,
                textAlign: "left",
                fontFamily: F,
                transition: "border-color 120ms ease-out, background 120ms ease-out",
                minHeight: 44,
              }}
              onMouseEnter={e => { if (!sel) { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.background = C.surfaceAlt; }}}
              onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}}
              onMouseDown={e => { e.currentTarget.style.transform = "scale(0.995)"; }}
              onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {/* Radio indicator */}
              <div style={{
                flexShrink: 0,
                marginTop: 3,
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: sel ? "6px solid " + theme.color : "2px solid " + C.borderMid,
                background: C.surface,
                boxSizing: "border-box",
                transition: "border-color 120ms ease-out, border-width 120ms ease-out",
              }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: sel ? C.textPrimary : C.textBody, margin: 0 }}>
                  {text}
                </p>
                {example && (
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: sel ? C.textMuted : C.textFaint, fontStyle: "italic", margin: "6px 0 0" }}>
                    {example}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={onPrev}
          disabled={isFirst}
          aria-disabled={isFirst}
          style={{
            padding: "12px 24px",
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 10,
            border: "1.5px solid " + (isFirst ? C.border : C.borderMid),
            background: C.surface,
            color: isFirst ? C.textFaint : C.textBody,
            cursor: isFirst ? "not-allowed" : "pointer",
            fontFamily: F,
            transition: "background 120ms ease-out, border-color 120ms ease-out",
            minHeight: 44,
          }}
          onMouseEnter={e => { if (!isFirst) { e.currentTarget.style.background = C.surfaceAlt; }}}
          onMouseLeave={e => { e.currentTarget.style.background = C.surface; }}
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selectedLevel}
          aria-disabled={!selectedLevel}
          style={{
            flex: 1,
            padding: "12px 24px",
            fontSize: 14,
            fontWeight: 700,
            borderRadius: 10,
            border: "none",
            background: selectedLevel ? theme.color : C.disabled,
            color: "#fff",
            cursor: selectedLevel ? "pointer" : "not-allowed",
            fontFamily: F,
            transition: "background 150ms ease-out",
            minHeight: 44,
          }}
          onMouseEnter={e => { if (selectedLevel) e.currentTarget.style.background = selectedLevel ? "#B83D1A" : C.disabled; }}
          onMouseLeave={e => { if (selectedLevel) e.currentTarget.style.background = theme.color; }}
          onMouseDown={e => { if (selectedLevel) e.currentTarget.style.transform = "scale(0.99)"; }}
          onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {isLast ? "View my results" : "Next question"}
        </button>
      </div>

      {!selectedLevel && (
        <p role="status" style={{ textAlign: "center", fontSize: 13, color: C.textFaint, margin: "12px 0 0" }}>
          Select an option above to continue.
        </p>
      )}
    </div>
  );
}

// ─── RESULTS SCREEN ───────────────────────────────────────────────────────────
function ResultsScreen({ answers, memberName, memberEmail, onRestart }) {
  const [copied, setCopied] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const topRef = useRef(null);

  useEffect(() => { topRef.current?.scrollIntoView({ behavior: "smooth" }); }, []);

  const lvlNum = { IC2: 2, IC3: 3, IC4: 4, IC5: 5 };
  const numLvl = { 2: "IC2", 3: "IC3", 4: "IC4", 5: "IC5" };
  const completedDate = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const results = THEMES.map(theme => {
    const scores = theme.subdimensions.map(sd => ({
      name: sd.name,
      level: answers[sd.id],
      num: lvlNum[answers[sd.id]] || 0,
    }));
    const avg = scores.reduce((s, r) => s + r.num, 0) / scores.length;
    return { theme, scores, avg, dominant: numLvl[Math.round(avg)] || "IC3" };
  });

  const overallAvg = results.reduce((s, r) => s + r.avg, 0) / results.length;
  const overallLevel = numLvl[Math.round(overallAvg)] || "IC3";

  const radarData = results.map(({ theme, avg }) => ({
    area: theme.name,
    score: parseFloat(avg.toFixed(2)),
    fullMark: 5,
  }));

  // ── PDF ──────────────────────────────────────────────────────────────────────
  const downloadPdf = () => {
    const rows = results.flatMap(({ theme, scores, avg, dominant }) =>
      scores.map((s, i) =>
        "<tr>" +
        (i === 0
          ? "<td rowspan=\"" + scores.length + "\" style=\"-webkit-print-color-adjust:exact;print-color-adjust:exact;padding:10px 12px;vertical-align:top;font-weight:700;font-size:11px;color:#fff;background:" + theme.color + ";border-radius:4px;white-space:nowrap;line-height:1.4;\">" +
            (theme.fullName || theme.name) +
            "<div style=\"font-size:9px;font-weight:500;margin-top:4px;opacity:0.85;\">" + dominant + " &middot; avg " + avg.toFixed(1) + "</div></td>"
          : "") +
        "<td style=\"padding:9px 14px;font-size:13px;color:#374151;border-bottom:1px solid #F3F4F6;\">" + s.name + "</td>" +
        "<td style=\"-webkit-print-color-adjust:exact;print-color-adjust:exact;padding:9px 14px;text-align:center;border-bottom:1px solid #F3F4F6;\"><span style=\"display:inline-block;padding:3px 10px;border-radius:20px;background:" + theme.color + ";color:#fff;font-size:11px;font-weight:700;\">" + (s.level || "&mdash;") + "</span><div style=\"font-size:10px;color:#9CA3AF;margin-top:2px;\">" + (LEVEL_LABELS[s.level] || "") + "</div></td>" +
        "</tr>"
      )
    ).join("");

    const html = "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"><title>" + memberName + " &mdash; Marketing Self-Assessment</title>" +
      "<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap\" rel=\"stylesheet\">" +
      "<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:\'Inter\',system-ui,sans-serif;background:#F7F6F5;padding:28px 16px;-webkit-print-color-adjust:exact;print-color-adjust:exact}" +
      ".wrap{max-width:680px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08)}" +
      ".hdr{-webkit-print-color-adjust:exact;print-color-adjust:exact;background:" + C.accent + ";padding:24px 32px}" +
      ".hdr .tag{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.7);margin-bottom:8px}" +
      ".hdr h1{font-size:20px;font-weight:700;color:#fff;margin-bottom:4px}" +
      ".hdr .sub{font-size:12px;color:rgba(255,255,255,0.8)}" +
      ".summary{display:flex;align-items:center;gap:24px;margin:24px 32px 16px;padding:20px;background:#F7F6F5;border-radius:12px;border:1px solid #E5E3E0}" +
      ".summary .lvl{font-size:44px;font-weight:800;color:" + C.accent + ";line-height:1;letter-spacing:-0.02em}" +
      ".summary .lbl{font-size:14px;color:#374151;font-weight:500;margin-top:4px}" +
      ".summary .avg{font-size:12px;color:#9CA3AF;margin-top:4px}" +
      ".tip{margin:0 32px 16px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:10px 14px;font-size:12px;color:#92400E}" +
      "table{width:calc(100% - 64px);margin:0 32px 28px;border-collapse:collapse;font-size:13px}" +
      ".ftr{background:#F7F6F5;padding:14px 32px;border-top:1px solid #E5E3E0;font-size:11px;color:#9CA3AF}" +
      "@media print{body{background:#fff;padding:0}.wrap{box-shadow:none;border-radius:0}.tip{display:none}}</style>" +
      "</head><body><div class=\"wrap\">" +
      "<div class=\"hdr\"><div class=\"tag\">Career Framework &middot; Marketing</div><h1>" + memberName + "&rsquo;s Self-Assessment Results</h1><div class=\"sub\">Completed " + completedDate + " &middot; Marketing job family</div></div>" +
      "<div class=\"summary\"><div><div class=\"lvl\">" + overallLevel + "</div><div class=\"lbl\">" + LEVEL_LABELS[overallLevel] + "</div><div class=\"avg\">Overall avg " + overallAvg.toFixed(1) + " / 5</div></div><div style=\"flex:1;font-size:13px;color:#6B7280;line-height:1.65;\">Indicative overall level across all 6 Marketing functional competencies. Use this as a starting point for your development conversation with your manager.</div></div>" +
      "<div class=\"tip\">To save as PDF: <strong>File &rarr; Print &rarr; Save as PDF</strong> &middot; Enable <strong>Background graphics</strong> in print settings to keep colours.</div>" +
      "<table><tbody>" + rows + "</tbody></table>" +
      "<div class=\"ftr\">saas.group &middot; Career Framework &middot; Marketing &middot; " + completedDate + " &middot; This is a starting point for your manager conversation, not a final assessment.</div>" +
      "</div></body></html>";

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 700);
  };

  // ── Email ────────────────────────────────────────────────────────────────────
  const buildEmailHtml = () => {
    const themeRows = results.map(({ theme, scores, avg, dominant }) =>
      "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin-bottom:10px;border-radius:10px;overflow:hidden;border:1px solid #E5E3E0;\">" +
      "<tr><td style=\"background:" + theme.color + ";padding:10px 16px;\"><span style=\"color:#fff;font-weight:700;font-size:13px;\">" + (theme.fullName || theme.name) + "</span><span style=\"color:rgba(255,255,255,0.8);font-size:11px;float:right;padding-top:2px;\">" + dominant + " &middot; avg " + avg.toFixed(1) + "</span></td></tr>" +
      scores.map(s =>
        "<tr><td style=\"background:#FAFAF9;padding:9px 16px;border-top:1px solid #E5E3E0;\"><span style=\"font-size:13px;color:#374151;\">" + s.name + "</span><span style=\"float:right;font-size:12px;font-weight:700;color:" + theme.color + ";\">" + (s.level || "&mdash;") + " &middot; " + (LEVEL_LABELS[s.level] || "") + "</span></td></tr>"
      ).join("") +
      "</table>"
    ).join("");

    return "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"></head>" +
      "<body style=\"margin:0;padding:0;background:#F7F6F5;font-family:Arial,sans-serif;\">" +
      "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#F7F6F5;padding:32px 16px;\"><tr><td align=\"center\">" +
      "<table width=\"580\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);\"><tr>" +
      "<td style=\"background:" + C.accent + ";padding:28px 32px;\"><div style=\"font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.7);margin-bottom:8px;\">Career Framework &middot; Marketing</div>" +
      "<div style=\"font-size:22px;font-weight:700;color:#fff;margin-bottom:4px;\">" + memberName + "&rsquo;s Self-Assessment Results</div>" +
      "<div style=\"font-size:13px;color:rgba(255,255,255,0.8);\">" + completedDate + " &middot; Marketing job family</div></td></tr>" +
      "<tr><td style=\"padding:24px 32px 8px;\"><div style=\"background:#F7F6F5;border-radius:10px;padding:18px 20px;margin-bottom:20px;border:1px solid #E5E3E0;\">" +
      "<div style=\"font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9CA3AF;margin-bottom:6px;\">Overall indicative level</div>" +
      "<div style=\"font-size:40px;font-weight:800;color:" + C.accent + ";line-height:1;letter-spacing:-0.02em;\">" + overallLevel + "</div>" +
      "<div style=\"font-size:13px;color:#374151;margin-top:4px;\">" + LEVEL_LABELS[overallLevel] + " &middot; avg " + overallAvg.toFixed(1) + " / 5</div></div>" +
      themeRows + "</td></tr>" +
      "<tr><td style=\"padding:4px 32px 28px;\"><div style=\"background:" + C.accentTint + ";border-radius:10px;padding:14px 18px;\">" +
      "<div style=\"font-weight:700;color:" + C.accent + ";font-size:13px;margin-bottom:4px;\">Next steps</div>" +
      "<div style=\"font-size:13px;color:#5A2010;line-height:1.65;\">Use these results as a starting point for your development conversation. Discuss where your self-assessment aligns with your manager&rsquo;s view &mdash; the gaps are the most valuable areas to explore.</div></div></td></tr>" +
      "<tr><td style=\"background:#F7F6F5;padding:14px 32px;border-top:1px solid #E5E3E0;\"><div style=\"font-size:11px;color:#9CA3AF;\">saas.group &middot; Career Framework &middot; Marketing &middot; " + completedDate + "</div></td></tr>" +
      "</table></td></tr></table></body></html>";
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "text/html": new Blob([buildEmailHtml()], { type: "text/html" }) }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch {
      await navigator.clipboard.writeText(memberName + " — Marketing Self-Assessment — " + completedDate + " — Overall: " + overallLevel).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    }
  };

  return (
    <div ref={topRef} style={{ minHeight: "100vh", background: C.bg, fontFamily: F }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px 64px" }}>

        {/* Header */}
        <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.accent, background: C.accentTint, padding: "4px 10px", borderRadius: 4, marginBottom: 16 }}>
          Results
        </span>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: C.textPrimary, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          {memberName}&rsquo;s marketing profile
        </h1>
        <p style={{ fontSize: 14, color: C.textFaint, margin: "0 0 28px" }}>
          Completed {completedDate} &middot; Share this with your manager to start your development conversation.
        </p>

        {/* Overall summary */}
        <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 16, padding: "24px", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <div style={{ textAlign: "center", minWidth: 80 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textFaint, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                Overall
              </div>
              <div style={{ fontSize: 44, fontWeight: 800, color: C.accent, lineHeight: 1, letterSpacing: "-0.02em" }}>
                {overallLevel}
              </div>
              <div style={{ fontSize: 13, color: C.textBody, fontWeight: 500, marginTop: 4 }}>
                {LEVEL_LABELS[overallLevel]}
              </div>
              <div style={{ fontSize: 12, color: C.textFaint, marginTop: 4 }}>
                avg {overallAvg.toFixed(1)} / 5
              </div>
            </div>
            <div style={{ flex: 1, borderLeft: "1px solid " + C.border, paddingLeft: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {results.map(({ theme, avg, dominant }) => (
                  <div key={theme.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: theme.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, color: C.textBody, flex: 1, minWidth: 0 }}>{theme.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: theme.color }}>{dominant}</span>
                    <span style={{ fontSize: 11, color: C.textFaint, minWidth: 40, textAlign: "right" }}>avg {avg.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Radar */}
        <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 14, padding: "16px 8px 8px", marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.textBody, textAlign: "center", margin: "0 0 2px" }}>
            Competency profile
          </p>
          <p style={{ fontSize: 11, color: C.textFaint, textAlign: "center", margin: "0 0 4px" }}>
            IC2 = inner ring &middot; IC5 = outer ring
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart cx="50%" cy="50%" outerRadius="64%" data={radarData}>
              <PolarGrid stroke={C.border} />
              <PolarAngleAxis
                dataKey="area"
                tick={{ fontSize: 11, fill: C.textBody, fontWeight: 500, fontFamily: "Inter, system-ui, sans-serif" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[1, 5]}
                tickCount={5}
                tick={{ fontSize: 9, fill: C.textFaint }}
                axisLine={false}
              />
              <Radar
                dataKey="score"
                stroke={C.accent}
                fill={C.accent}
                fillOpacity={0.12}
                strokeWidth={2}
                dot={{ r: 4, fill: C.accent, strokeWidth: 0 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Competency breakdown */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 0 16px" }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.textFaint, whiteSpace: "nowrap" }}>
              Competency breakdown
            </span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {results.map(({ theme, scores, avg, dominant }) => (
              <div key={theme.id} style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", background: theme.color, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 13.5 }}>{theme.fullName}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ color: "rgba(255,255,255,0.95)", fontSize: 13, fontWeight: 700 }}>{dominant}</span>
                    <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>avg {avg.toFixed(1)}</span>
                  </div>
                </div>
                <div style={{ padding: "12px 16px" }}>
                  {scores.map((s, i) => (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < scores.length - 1 ? 10 : 0 }}>
                      <div style={{ flex: "0 0 auto", fontSize: 12, color: C.textBody, fontWeight: 500, lineHeight: 1.3, maxWidth: 160, minWidth: 120 }}>
                        {s.name}
                      </div>
                      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ flex: 1, height: 6, background: C.bg, borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: ((lvlNum[s.level] || 0) / 5) * 100 + "%", background: theme.color, borderRadius: 3, transition: "width 700ms ease-out" }} />
                        </div>
                        <div style={{ textAlign: "right", minWidth: 96 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: theme.color }}>{s.level || "—"}</span>
                          {s.level && <span style={{ fontSize: 11, color: C.textFaint, marginLeft: 4 }}>&middot; {LEVEL_LABELS[s.level]}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share */}
        <div style={{ background: C.accentTint, border: "1px solid " + C.accentBorder, borderRadius: 14, padding: "20px 24px", marginBottom: 8 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: C.accent, margin: "0 0 6px" }}>Share with your manager</h2>
          <p style={{ fontSize: 13.5, color: "#5A2010", lineHeight: 1.65, margin: "0 0 16px" }}>
            Choose how you&apos;d like to share. Both options include your full results.
          </p>

          {/* Option A */}
          <div style={{ background: C.surface, border: "1px solid " + C.accentBorder, borderRadius: 10, padding: "16px", marginBottom: 10 }}>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: C.textPrimary, margin: "0 0 4px" }}>Option A &mdash; Download PDF</p>
            <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6, margin: "0 0 14px" }}>
              Opens a print-ready page. Choose <strong>File &rarr; Print &rarr; Save as PDF</strong> (Cmd+P / Ctrl+P). Enable <strong>Background graphics</strong> in print settings to preserve colours.
            </p>
            <button
              onClick={downloadPdf}
              style={{ width: "100%", padding: "12px 16px", fontSize: 14, fontWeight: 700, borderRadius: 9, border: "none", background: C.accent, color: "#fff", cursor: "pointer", fontFamily: F, minHeight: 44, transition: "background 150ms ease-out" }}
              onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.99)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              Download PDF
            </button>
          </div>

          {/* Option B */}
          <div style={{ background: C.surface, border: "1px solid " + C.accentBorder, borderRadius: 10, padding: "16px" }}>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: C.textPrimary, margin: "0 0 4px" }}>Option B &mdash; Copy formatted email</p>
            <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6, margin: "0 0 12px" }}>
              Copies a fully formatted HTML email to your clipboard.
            </p>
            <ol style={{ margin: "0 0 14px", paddingLeft: 20, fontSize: 13, color: "#5A2010", lineHeight: 1.9 }}>
              <li>Open a <strong>new email</strong> in Gmail or Outlook</li>
              <li>Paste &mdash; <strong>Cmd+V</strong> (Mac) or <strong>Ctrl+V</strong> (Windows)</li>
              <li>Address it to your manager and CC yourself at <strong>{memberEmail}</strong></li>
              <li>Send</li>
            </ol>
            <button
              onClick={copyEmail}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: 14,
                fontWeight: 700,
                borderRadius: 9,
                border: "none",
                background: copied ? C.success : "#5E51A3",
                color: "#fff",
                cursor: "pointer",
                fontFamily: F,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                minHeight: 44,
                transition: "background 150ms ease-out",
              }}
              onMouseEnter={e => { if (!copied) e.currentTarget.style.background = "#4A3E90"; }}
              onMouseLeave={e => { if (!copied) e.currentTarget.style.background = "#5E51A3"; }}
            >
              {copied ? "Copied — open a new email and paste" : "Copy email"}
            </button>
          </div>
        </div>

        {/* Restart */}
        {!showRestartConfirm ? (
          <button
            onClick={() => setShowRestartConfirm(true)}
            style={{ width: "100%", marginTop: 8, padding: "12px 20px", fontSize: 13.5, fontWeight: 600, borderRadius: 10, border: "1.5px solid " + C.border, background: "transparent", color: C.textFaint, cursor: "pointer", fontFamily: F, minHeight: 44, transition: "border-color 120ms ease-out, color 120ms ease-out" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.color = C.textMuted; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textFaint; }}
          >
            Start over
          </button>
        ) : (
          <div style={{ marginTop: 8, background: C.destructiveBg, border: "1px solid " + C.destructiveBorder, borderRadius: 10, padding: "16px 20px" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#991B1B", margin: "0 0 12px" }}>
              Start over? All your answers will be lost and cannot be recovered.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setShowRestartConfirm(false)}
                style={{ flex: 1, padding: "11px 16px", fontSize: 13.5, fontWeight: 600, borderRadius: 8, border: "1.5px solid " + C.border, background: C.surface, color: C.textBody, cursor: "pointer", fontFamily: F, minHeight: 44 }}
              >
                Cancel
              </button>
              <button
                onClick={onRestart}
                style={{ flex: 1, padding: "11px 16px", fontSize: 13.5, fontWeight: 700, borderRadius: 8, border: "none", background: C.destructive, color: "#fff", cursor: "pointer", fontFamily: F, minHeight: 44 }}
              >
                Yes, start over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const allQ = THEMES.flatMap(theme =>
    theme.subdimensions.map(sd => ({ theme, subdimension: sd }))
  );

  // Restore progress
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (s.screen && s.screen !== "intro") {
        setScreen(s.screen);
        setQIdx(s.qIdx || 0);
        setAnswers(s.answers || {});
        setMemberName(s.memberName || "");
        setMemberEmail(s.memberEmail || "");
      }
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ screen, qIdx, answers, memberName, memberEmail }));
    } catch {}
  }, [screen, qIdx, answers, memberName, memberEmail]);

  const select = lv => setAnswers(p => ({ ...p, [allQ[qIdx].subdimension.id]: lv }));

  const next = () => {
    if (qIdx === allQ.length - 1) { setScreen("results"); return; }
    setQIdx(i => i + 1);
  };

  const prev = () => { if (qIdx > 0) setQIdx(i => i - 1); };

  const restart = () => {
    setScreen("intro"); setQIdx(0); setAnswers({}); setMemberName(""); setMemberEmail("");
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const handleStart = (name, email) => {
    setMemberName(name); setMemberEmail(email); setScreen("questions");
  };

  if (screen === "intro") return <IntroScreen onStart={handleStart} />;
  if (screen === "results") return <ResultsScreen answers={answers} memberName={memberName} memberEmail={memberEmail} onRestart={restart} />;

  const q = allQ[qIdx];
  const isLastQ = qIdx === allQ.length - 1;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: F }}>
      <ProgressBar current={qIdx} total={allQ.length} themeColor={q.theme.color} />
      <QuestionCard
        theme={q.theme}
        subdimension={q.subdimension}
        selectedLevel={answers[q.subdimension.id] || null}
        onSelect={select}
        onNext={next}
        onPrev={prev}
        isFirst={qIdx === 0}
        isLast={isLastQ}
        questionNumber={qIdx + 1}
      />
    </div>
  );
}
