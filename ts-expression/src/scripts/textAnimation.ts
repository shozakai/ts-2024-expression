import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ScrollTriggerを登録
gsap.registerPlugin(ScrollTrigger);

// テキストアニメーション
const textElements = document.querySelectorAll('[data-text-animation]');
textElements.forEach((element) => {
  const htmlElement = element as HTMLElement;
  const duration = parseFloat(htmlElement.dataset.duration || '1') || 1;
  const ease = htmlElement.dataset.ease || 'power2.out';
  const delay = parseFloat(htmlElement.dataset.delay || '0') || 0;

  gsap.to(element, {
    y: 0,
    duration: duration,
    ease: ease,
    delay: delay,
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });
}); 