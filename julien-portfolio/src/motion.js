import anime from 'animejs';

/**
 * Centralized Motion System for Futuristic AI Engineer Aesthetic
 * All animations use easeOutExpo for controlled, measured feel
 */

/**
 * Fade Up with Blur - Premium section reveal
 * Combines opacity, vertical movement, and blur for sophisticated entrance
 */
export const fadeUpBlur = (target, options = {}) => {
  const {
    duration = 800,
    delay = 0,
    blur = 8,
    distance = 40
  } = options;

  return anime({
    targets: target,
    opacity: [0, 1],
    translateY: [distance, 0],
    filter: [`blur(${blur}px)`, 'blur(0px)'],
    duration,
    delay,
    easing: 'easeOutExpo'
  });
};

/**
 * Fade Left with Blur - Hero text entrance
 * Slides in from left with blur-to-sharp effect
 */
export const fadeLeftBlur = (target, options = {}) => {
  const {
    duration = 800,
    delay = 0,
    blur = 8,
    distance = 50
  } = options;

  return anime({
    targets: target,
    opacity: [0, 1],
    translateX: [-distance, 0],
    filter: [`blur(${blur}px)`, 'blur(0px)'],
    duration,
    delay,
    easing: 'easeOutExpo'
  });
};

/**
 * Glow Pulse - Cyan accent effect
 * Creates subtle breathing glow effect
 */
export const glowPulse = (target, options = {}) => {
  const {
    intensity = 0.6,
    duration = 2000,
    loop = true
  } = options;

  return anime({
    targets: target,
    boxShadow: [
      `0 0 20px rgba(255, 216, 77, ${intensity * 0.3})`,
      `0 0 40px rgba(139, 92, 246, ${intensity})`
    ],
    duration,
    easing: 'easeInOutQuad',
    direction: 'alternate',
    loop
  });
};

/**
 * Parallax Tilt - Mouse-based 3D tilt effect
 * Rotates element based on mouse position
 * Creates sense of depth and interactivity
 */
export const parallaxTilt = (element, options = {}) => {
  if (!element) return () => {}; // Return no-op cleanup if element doesn't exist

  const {
    maxTilt = 6,
    speed = 300
  } = options;

  const handleMove = (e) => {
    const rect = element.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    anime.set(element, {
      rotateY: x * maxTilt,
      rotateX: -y * maxTilt
    });
  };

  const reset = () => {
    anime({
      targets: element,
      rotateX: 0,
      rotateY: 0,
      duration: speed,
      easing: 'easeOutExpo'
    });
  };

  element.addEventListener('mousemove', handleMove);
  element.addEventListener('mouseleave', reset);

  // Return cleanup function
  return () => {
    element.removeEventListener('mousemove', handleMove);
    element.removeEventListener('mouseleave', reset);
  };
};

/**
 * Scale Glow Hover - Futuristic card hover
 * Combines subtle scale with cyan glow
 */
export const scaleGlowHover = (target, options = {}) => {
  const {
    scaleAmount = 1.02,
    glowIntensity = 0.5,
    duration = 300
  } = options;

  return anime({
    targets: target,
    scale: scaleAmount,
    boxShadow: `0 8px 32px rgba(139, 92, 246, ${glowIntensity}), inset 0 1px 8px rgba(255, 216, 77, 0.2)`,
    duration,
    easing: 'easeOutQuad'
  });
};

/**
 * Glow Reset - Return to normal state
 */
export const glowReset = (target, options = {}) => {
  const {
    duration = 300
  } = options;

  return anime({
    targets: target,
    scale: 1,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 216, 77, 0.2)',
    duration,
    easing: 'easeOutQuad'
  });
};

/**
 * Breathing Glow - Avatar loading state
 * Pulsing cyan ring effect
 */
export const breathingGlow = (target, options = {}) => {
  const {
    duration = 2000,
    loop = true
  } = options;

  return anime({
    targets: target,
    boxShadow: [
      '0 0 15px rgba(255, 216, 77, 0.35), 0 0 30px rgba(139, 92, 246, 0.2)',
      '0 0 30px rgba(255, 216, 77, 0.75), 0 0 60px rgba(139, 92, 246, 0.4)'
    ],
    duration,
    easing: 'easeInOutSine',
    direction: 'alternate',
    loop
  });
};

/**
 * Stagger Timeline Helper
 * Creates smooth staggered entrance for multiple elements
 */
export const staggerEnter = (targets, options = {}) => {
  const {
    duration = 600,
    staggerDelay = 60,
    startDelay = 0,
    distance = 30,
    blur = 6
  } = options;

  return anime.timeline()
    .add({
      targets,
      opacity: [0, 1],
      translateY: [distance, 0],
      filter: [`blur(${blur}px)`, 'blur(0px)'],
      duration,
      delay: anime.stagger(staggerDelay),
      easing: 'easeOutExpo'
    }, startDelay);
};

/**
 * Hero Timeline - Coordinated entrance animation
 * Orchestrates multiple elements with controlled timing
 */
export const heroTimeline = (options = {}) => {
  const {
    titleDuration = 900,
    NavDuration = 600,
    badgeDuration = 500,
    staggerDelay = 60
  } = options;

  return anime.timeline()
    .add({
      targets: '.site-title',
      opacity: [0, 1],
      translateY: [20, 0],
      duration: titleDuration,
      easing: 'easeOutExpo'
    })
    .add({
      targets: '.nav-links li',
      opacity: [0, 1],
      translateY: [15, 0],
      duration: NavDuration,
      delay: anime.stagger(staggerDelay),
      easing: 'easeOutExpo'
    }, 200)
    .add({
      targets: '.hero-title',
      opacity: [0, 1],
      translateX: [-40, 0],
      filter: ['blur(8px)', 'blur(0px)'],
      duration: titleDuration,
      easing: 'easeOutExpo'
    }, 300)
    .add({
      targets: '.hero-text h1:nth-of-type(2)',
      opacity: [0, 1],
      translateX: [-40, 0],
      filter: ['blur(6px)', 'blur(0px)'],
      duration: titleDuration,
      easing: 'easeOutExpo'
    }, 500)
    .add({
      targets: '.typer',
      opacity: [0, 1],
      translateX: [-30, 0],
      duration: NavDuration,
      delay: anime.stagger(80),
      easing: 'easeOutExpo'
    }, 700)
    .add({
      targets: '.profile-image',
      opacity: [0, 1],
      scale: [0.85, 1],
      duration: titleDuration,
      easing: 'easeOutExpo'
    }, 500)
    .add({
      targets: '.tech-badge',
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: badgeDuration,
      delay: anime.stagger(staggerDelay),
      easing: 'easeOutExpo'
    }, 1000);
};
