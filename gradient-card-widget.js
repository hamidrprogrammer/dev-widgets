/* gradient-card-widget.js - Vanilla JS Gradient Card (no React) */
(function () {
  const defaults = {
    width: 360,
    height: 450,
    title: "AI-Powered Inbox Sorting",
    description:
      "OpenMail revolutionizes email management with AI-driven sorting, boosting productivity and accessibility",
    ctaText: "Learn More",
    ctaHref: "#",
    bgColor: "#0e131f",
    hoverLift: 5,      // px
    maxTilt: 5,        // deg
    blurGlow: 40,      // px
    containerBg: "#000",
  };

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function createEl(tag, props = {}, style = {}) {
    const el = document.createElement(tag);
    Object.assign(el, props);
    Object.assign(el.style, style);
    return el;
  }

  function injectBaseStyles(rootId) {
    if (document.getElementById(rootId + "-styles")) return;
    const style = document.createElement("style");
    style.id = rootId + "-styles";
    style.textContent = `
      .gcw-wrap { position:relative; width:100%; display:flex; align-items:center; justify-content:center; }
      .gcw-scene { perspective:1000px; -webkit-perspective:1000px; }
      .gcw-card {
        position:relative; border-radius:32px; overflow:hidden;
        transform-style:preserve-3d; will-change:transform, filter;
        box-shadow: 0 -10px 100px 10px rgba(78,99,255,0.25), 0 0 10px 0 rgba(0,0,0,0.5);
      }
      .gcw-abs { position:absolute; inset:0; pointer-events:none; }
      .gcw-content { position:relative; z-index:40; display:flex; flex-direction:column; height:100%; padding:32px; color:#fff; }
      .gcw-title { font-size:22px; line-height:1.2; letter-spacing:-0.01em; font-weight:600; margin:0 0 12px; }
      .gcw-desc  { font-size:14px; line-height:1.5; opacity:.85; margin:0 0 24px; }
      .gcw-cta { display:inline-flex; align-items:center; gap:6px; color:#fff; font-size:14px; text-decoration:none; opacity:.9; }
      .gcw-cta svg { width:16px; height:16px; }
      .gcw-icon {
        width:48px; height:48px; border-radius:999px; display:flex; align-items:center; justify-content:center; margin-bottom:24px;
        background:linear-gradient(225deg, #171c2c 0%, #121624 100%); position:relative; overflow:hidden;
      }
      .gcw-icon .top-hi {
        position:absolute; top:0; left:0; width:66%; height:66%; opacity:.4;
        background: radial-gradient(circle at top left, rgba(255,255,255,.5), transparent 80%);
        filter: blur(10px);
      }
      .gcw-icon .bot-sh {
        position:absolute; bottom:0; left:0; width:100%; height:50%; opacity:.5;
        background: linear-gradient(to top, rgba(0,0,0,.4), transparent);
        backdrop-filter: blur(3px);
      }
      /* glossy bottom line */
      .gcw-bottom-line {
        position:absolute; left:0; right:0; bottom:0; height:2px;
        background:linear-gradient(90deg, rgba(255,255,255,.05) 0%, rgba(255,255,255,.7) 50%, rgba(255,255,255,.05) 100%);
        z-index:25;
      }
    `;
    document.head.appendChild(style);
  }

  function buildCard(root, opts) {
    // container
    const wrap = createEl("div", { className: "gcw-wrap" }, {
      background: opts.containerBg,
      width: "100%", height: "100%", minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
    });

    const scene = createEl("div", { className: "gcw-scene" }, { });
    const card = createEl("div", { className: "gcw-card" }, {
      width: opts.width + "px",
      height: opts.height + "px",
      backgroundColor: opts.bgColor,
      borderRadius: "32px",
      transform: "translateZ(0)",
    });

    // layers
    const glass = createEl("div", { className: "gcw-abs" }, {
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.05) 100%)",
      backdropFilter: "blur(2px)",
      zIndex: 35,
    });
    const darkBg = createEl("div", { className: "gcw-abs" }, {
      background: "linear-gradient(180deg, #000000 0%, #000000 70%)",
      zIndex: 0,
    });
    const noise = createEl("div", { className: "gcw-abs" }, {
      mixBlendMode: "overlay",
      opacity: "0.30",
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
      zIndex: 10,
    });
    const smudge = createEl("div", { className: "gcw-abs" }, {
      mixBlendMode: "soft-light",
      opacity: "0.10",
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='smudge'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01' numOctaves='3' seed='5' stitchTiles='stitch'/%3E%3CfeGaussianBlur stdDeviation='10'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23smudge)'/%3E%3C/svg%3E\")",
      backdropFilter: "blur(1px)",
      zIndex: 11,
    });
    const glowBottom = createEl("div", { className: "gcw-abs" }, {
      zIndex: 20,
      background: `
        radial-gradient(ellipse at bottom right, rgba(172, 92, 255, 0.7) -10%, rgba(79, 70, 229, 0) 70%),
        radial-gradient(ellipse at bottom left, rgba(56, 189, 248, 0.7) -10%, rgba(79, 70, 229, 0) 70%)
      `,
      filter: `blur(${defaults.blurGlow}px)`,
      bottom: "0", height: "66%",
    });
    const glowCenter = createEl("div", { className: "gcw-abs" }, {
      zIndex: 21,
      background:
        "radial-gradient(circle at bottom center, rgba(161, 58, 229, 0.7) -20%, rgba(79, 70, 229, 0) 60%)",
      filter: `blur(${defaults.blurGlow + 5}px)`,
      bottom: "0", height: "66%",
    });

    const bottomLine = createEl("div", { className: "gcw-bottom-line" });

    // content
    const content = createEl("div", { className: "gcw-content" });
    const icon = createEl("div", { className: "gcw-icon" });
    icon.appendChild(createEl("div", { className: "top-hi" }));
    icon.appendChild(createEl("div", { className: "bot-sh" }));
    // star svg
    const star = createEl("div", {}, { position: "relative", zIndex: 10 });
    star.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 0L9.4 5.4L14.8 5.4L10.6 8.8L12 14.2L8 10.8L4 14.2L5.4 8.8L1.2 5.4L6.6 5.4L8 0Z" fill="white"/>
      </svg>`;
    icon.appendChild(star);

    const title = createEl("h3", { className: "gcw-title", textContent: opts.title });
    const desc  = createEl("p",  { className: "gcw-desc",  textContent: opts.description });

    const cta = createEl("a", { className: "gcw-cta", href: opts.ctaHref, textContent: opts.ctaText });
    const arrow = createEl("span");
    arrow.innerHTML = `
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 8H15M15 8L8 1M15 8L8 15" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    cta.appendChild(arrow);

    content.appendChild(icon);
    content.appendChild(title);
    content.appendChild(desc);
    content.appendChild(cta);

    // compose
    card.appendChild(darkBg);
    card.appendChild(noise);
    card.appendChild(smudge);
    card.appendChild(glass);
    card.appendChild(glowBottom);
    card.appendChild(glowCenter);
    card.appendChild(bottomLine);
    card.appendChild(content);

    scene.appendChild(card);
    wrap.appendChild(scene);
    root.appendChild(wrap);

    // animation state
    let hovered = false;
    let rotX = 0, rotY = 0;
    let targetRotX = 0, targetRotY = 0;
    let lift = 0, targetLift = 0;
    let raf = null;

    const update = () => {
      // ease
      rotX += (targetRotX - rotX) * 0.12;
      rotY += (targetRotY - rotY) * 0.12;
      lift += (targetLift - lift) * 0.12;

      // apply
      card.style.transform =
        `translate3d(0, ${-lift}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

      // subtle parallax on overlays
      glass.style.transform = `translateZ(1px) rotateX(${-rotX * 0.2}deg) rotateY(${-rotY * 0.2}deg)`;
      glowBottom.style.opacity = hovered ? "0.9" : "0.8";
      glowCenter.style.opacity = hovered ? "0.85" : "0.75";

      // icon lift and tilt
      const iconTiltX = hovered ? -rotX * 0.5 : 0;
      const iconTiltY = hovered ? -rotY * 0.5 : 0;
      icon.style.transform = `translate3d(0, ${hovered ? -2 : 0}px, 0) rotateX(${iconTiltX}deg) rotateY(${iconTiltY}deg)`;

      raf = requestAnimationFrame(update);
    };

    function onEnter() { hovered = true; targetLift = opts.hoverLift; }
    function onLeave() { hovered = false; targetLift = 0; targetRotX = 0; targetRotY = 0; }

    function onMove(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const nx = x / rect.width;   // -0.5 .. 0.5
      const ny = y / rect.height;  // -0.5 .. 0.5
      targetRotX = clamp(-(ny) * (opts.maxTilt * 2), -opts.maxTilt, opts.maxTilt);
      targetRotY = clamp((nx) * (opts.maxTilt * 2), -opts.maxTilt, opts.maxTilt);
    }

    // touch fallback: simple float on touch
    let touchTimer = null;
    function startFloat() {
      if (touchTimer) return;
      let t = 0;
      touchTimer = setInterval(() => {
        targetRotX = Math.sin(t) * (opts.maxTilt * 0.3);
        targetRotY = Math.cos(t * 0.9) * (opts.maxTilt * 0.3);
        targetLift = opts.hoverLift * 0.6;
        t += 0.08;
      }, 33);
    }
    function stopFloat() { clearInterval(touchTimer); touchTimer = null; onLeave(); }

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerleave", onLeave);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("touchstart", startFloat, { passive: true });
    card.addEventListener("touchend", stopFloat, { passive: true });

    raf = requestAnimationFrame(update);

    // return a small API for cleanup or resize
    return {
      destroy() {
        cancelAnimationFrame(raf);
        stopFloat();
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointerleave", onLeave);
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("touchstart", startFloat);
        card.removeEventListener("touchend", stopFloat);
        root.innerHTML = "";
      }
    };
  }

  const GradientCardWidget = {
    init: function (selector, options = {}) {
      const root = typeof selector === "string" ? document.querySelector(selector) : selector;
      if (!root) throw new Error("GradientCardWidget: container not found");
      const opts = Object.assign({}, defaults, options);
      injectBaseStyles("gcw");
      return buildCard(root, opts);
    }
  };

  window.GradientCardWidget = GradientCardWidget;
})();
