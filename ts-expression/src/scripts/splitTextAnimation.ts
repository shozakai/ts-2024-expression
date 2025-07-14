import { gsap, CustomEase } from 'gsap/all';

// スプリットテキストアニメーション
gsap.registerPlugin(CustomEase);

CustomEase.create('custom', 'M0,0 C0.083,0.294 0.174,0.73 0.44,0.92 0.571,1.013 0.752,1 1,1 ');

const splitTextElements = document.querySelectorAll('[data-split-text]');
splitTextElements.forEach((element) => {
  const htmlElement = element as HTMLElement;
  const duration = parseFloat(htmlElement.dataset.duration || '0.8');
  const ease = htmlElement.dataset.ease || 'power2.out';
  const stagger = parseFloat(htmlElement.dataset.stagger || '0.03');
  const delay = parseFloat(htmlElement.dataset.delay || '0');
  
  const chars = element.querySelectorAll('.split-char');
  
  gsap.to(chars, {
    y: 0,
    // opacity: 1,
    autoAlpha: 1,
    duration: duration,
    ease: 'custom',
    stagger: stagger,
    delay: delay
  });
}); 