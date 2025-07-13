import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// プラグインを登録
gsap.registerPlugin(ScrollTrigger, SplitText);

// スプリットテキストライン用のアニメーション
const splitTextLinesElements = document.querySelectorAll('[data-split-text-lines]');
splitTextLinesElements.forEach((element) => {
  const htmlElement = element as HTMLElement;
  const duration = parseFloat(htmlElement.dataset.duration || '0.8');
  const ease = htmlElement.dataset.ease || 'power2.out';
  const stagger = parseFloat(htmlElement.dataset.stagger || '0.1');
  const delay = parseFloat(htmlElement.dataset.delay || '0');

  gsap.set(element, {
    opacity: 1
  });
  
  // SplitTextで行ごとに分割
  const splitText = new SplitText(element, {
    type: "lines",
    linesClass: "split-line"
  });
  
  // 各行を更にwrapして overflow hidden を適用
  splitText.lines.forEach((line) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'split-line-wrapper';
    wrapper.style.overflow = 'hidden';
    
    if (line.parentNode) {
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    }
    
    // 初期状態を設定
    gsap.set(line, {
      y: '100%',
      opacity: 0
    });
  });
  
  // アニメーションを実行
  gsap.to(splitText.lines, {
    y: '0%',
    opacity: 1,
    duration: duration,
    ease: ease,
    stagger: stagger,
    delay: delay,
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });
}); 