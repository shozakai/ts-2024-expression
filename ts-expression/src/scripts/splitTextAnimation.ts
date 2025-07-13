import { gsap } from 'gsap';

// スプリットテキストアニメーション
const splitTextElements = document.querySelectorAll('[data-split-text]');
splitTextElements.forEach((element) => {
  const htmlElement = element as HTMLElement;
  const duration = parseFloat(htmlElement.dataset.duration || '0.8');
  const ease = htmlElement.dataset.ease || 'power2.out';
  const stagger = parseFloat(htmlElement.dataset.stagger || '0.05');
  const delay = parseFloat(htmlElement.dataset.delay || '0');
  
  const chars = element.querySelectorAll('.split-char');
  
  gsap.to(chars, {
    y: 0,
    // opacity: 1,
    duration: duration,
    ease: ease,
    stagger: stagger,
    delay: delay
  });
}); 