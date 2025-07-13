import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ScrollTriggerを登録
gsap.registerPlugin(ScrollTrigger);

// スプリットテキストアニメーション
const splitTextElements = document.querySelectorAll('[data-split-text]');
splitTextElements.forEach((element) => {
  const htmlElement = element as HTMLElement;
  const duration = parseFloat(htmlElement.dataset.duration || '0.8');
  const ease = htmlElement.dataset.ease || 'power2.out';
  const stagger = parseFloat(htmlElement.dataset.stagger || '0.05');
  
  const chars = element.querySelectorAll('.split-char');
  
  gsap.to(chars, {
    y: 0,
    opacity: 1,
    duration: duration,
    ease: ease,
    stagger: stagger,
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });
}); 