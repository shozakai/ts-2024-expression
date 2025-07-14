import { gsap, CustomEase } from 'gsap/all';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ScrollTriggerを登録
gsap.registerPlugin(ScrollTrigger);

gsap.registerPlugin(CustomEase);

CustomEase.create('custom', 'M0,0 C0.11,0.494 0.225,0.741 0.351,0.867 0.483,0.999 0.504,1 1,1 ');

// ラインアニメーション
const lines = document.querySelectorAll('[data-line]');
lines.forEach((line) => {
  const htmlElement = line as HTMLElement;
  const type = htmlElement.dataset.line;
  const duration = parseFloat(htmlElement.dataset.duration || '1.2') || 1.2;
  const ease = htmlElement.dataset.ease || 'power2.out';
  const delay = parseFloat(htmlElement.dataset.delay || '0') || 0;
  const animationProps = {
    duration: duration,
    ease: 'custom',
    delay: delay,
    scrollTrigger: {
      trigger: line,
      start: "top 100%",
      toggleActions: "play none none none"
    }
  };

  if (type === 'horizontal') {
    gsap.to(line, {
      ...animationProps,
      scaleX: 1
    });
  } else if (type === 'vertical') {
    gsap.to(line, {
      ...animationProps,
      scaleY: 1
    });
  }
}); 