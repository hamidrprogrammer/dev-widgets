class GradientCardWidget extends HTMLElement {
  connectedCallback() {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      background: black;
      width: 100vw;
      height: 100vh;
      margin: 0;
      overflow: hidden;
    `;

    const card = document.createElement('div');
    Object.assign(card.style, {
      width: '360px',
      height: '450px',
      borderRadius: '32px',
      backgroundColor: '#0e131f',
      boxShadow: '0 -10px 100px 10px rgba(78, 99, 255, 0.25), 0 0 10px rgba(0,0,0,0.5)',
      position: 'relative',
      transformStyle: 'preserve-3d',
      transition: 'transform 0.4s ease',
      perspective: '1000px',
      overflow: 'hidden'
    });

    // Reflection Overlay
    const reflection = document.createElement('div');
    Object.assign(reflection.style, {
      position: 'absolute',
      inset: '0',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.05) 100%)',
      backdropFilter: 'blur(2px)',
      pointerEvents: 'none'
    });

    // Noise Texture Overlay
    const noise = document.createElement('div');
    Object.assign(noise.style, {
      position: 'absolute',
      inset: '0',
      opacity: '0.3',
      mixBlendMode: 'overlay',
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      pointerEvents: 'none'
    });

    // Smudge Texture Overlay
    const smudge = document.createElement('div');
    Object.assign(smudge.style, {
      position: 'absolute',
      inset: '0',
      opacity: '0.1',
      mixBlendMode: 'soft-light',
      backdropFilter: 'blur(1px)',
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='smudge'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01' numOctaves='3' seed='5' stitchTiles='stitch'/%3E%3CfeGaussianBlur stdDeviation='10'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23smudge)'/%3E%3C/svg%3E")`,
      pointerEvents: 'none'
    });

    // Glow Background
    const glow1 = document.createElement('div');
    Object.assign(glow1.style, {
      position: 'absolute',
      bottom: '0',
      left: '0',
      right: '0',
      height: '66%',
      background: `
        radial-gradient(ellipse at bottom right, rgba(172, 92, 255, 0.7) -10%, rgba(79, 70, 229, 0) 70%),
        radial-gradient(ellipse at bottom left, rgba(56, 189, 248, 0.7) -10%, rgba(79, 70, 229, 0) 70%)
      `,
      filter: 'blur(40px)',
      pointerEvents: 'none'
    });

    const glow2 = document.createElement('div');
    Object.assign(glow2.style, {
      position: 'absolute',
      bottom: '0',
      left: '0',
      right: '0',
      height: '66%',
      background: `
        radial-gradient(circle at bottom center, rgba(161, 58, 229, 0.7) -20%, rgba(79, 70, 229, 0) 60%)
      `,
      filter: 'blur(45px)',
      pointerEvents: 'none'
    });

    // Content Container
    const content = document.createElement('div');
    Object.assign(content.style, {
      position: 'relative',
      zIndex: '2',
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      color: 'white',
      fontFamily: 'sans-serif'
    });

    const iconCircle = document.createElement('div');
    Object.assign(iconCircle.style, {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      marginBottom: '24px',
      background: 'linear-gradient(225deg, #171c2c 0%, #121624 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    });

    const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    star.setAttribute('width', '20');
    star.setAttribute('height', '20');
    star.setAttribute('viewBox', '0 0 16 16');
    star.innerHTML = `<path d="M8 0L9.4 5.4L14.8 5.4L10.6 8.8L12 14.2L8 10.8L4 14.2L5.4 8.8L1.2 5.4L6.6 5.4L8 0Z" fill="white"/>`;

    const title = document.createElement('h3');
    title.textContent = 'AI‑Powered Inbox Sorting';
    Object.assign(title.style, {
      fontSize: '24px',
      marginBottom: '12px',
      lineHeight: '1.2'
    });

    const desc = document.createElement('p');
    desc.textContent = 'OpenMail revolutionizes email management with AI-driven sorting, boosting productivity and accessibility';
    Object.assign(desc.style, {
      fontSize: '14px',
      marginBottom: '24px',
      color: '#ccc',
      lineHeight: '1.5'
    });

    const learn = document.createElement('a');
    learn.textContent = 'Learn More';
    learn.href = '#';
    Object.assign(learn.style, {
      fontSize: '14px',
      color: 'white',
      textDecoration: 'none'
    });

    // Construct DOM
    iconCircle.appendChild(star);
    content.append(iconCircle, title, desc, learn);
    card.append(reflection, glow1, glow2, noise, smudge, content);
    wrapper.appendChild(card);
    this.appendChild(wrapper);

    // Animation handlers
    let isHover = false;
    card.addEventListener('mouseenter', () => (isHover = true));
    card.addEventListener('mouseleave', () => {
      isHover = false;
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
      reflection.style.opacity = '0.5';
      glow1.style.opacity = glow2.style.opacity = '0.8';
    });
    card.addEventListener('mousemove', (e) => {
      if (!isHover) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = (-(y / rect.height) * 5).toFixed(2);
      const rotY = ((x / rect.width) * 5).toFixed(2);
      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
      reflection.style.opacity = '0.7';
      glow1.style.opacity = glow2.style.opacity = '0.9';
    });
  }
}

customElements.define('gradient-card-widget', GradientCardWidget);
