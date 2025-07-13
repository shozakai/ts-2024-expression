import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ScrollTriggerを登録
gsap.registerPlugin(ScrollTrigger);

// ラインアニメーション
const lines = document.querySelectorAll('[data-line]');
lines.forEach((line) => {
  const htmlElement = line as HTMLElement;
  const type = htmlElement.dataset.line;
  const duration = parseFloat(htmlElement.dataset.duration || '1') || 1;
  const ease = htmlElement.dataset.ease || 'power2.out';

  const animationProps = {
    duration: duration,
    ease: ease,
    scrollTrigger: {
      trigger: line,
      start: "top 80%",
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