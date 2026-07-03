import { useEffect, useRef } from "react";
import gsap from "gsap";

// 요소가 뷰포트에 들어오면 GSAP로 페이드업.
// gsap.from을 쓰므로 애니메이션 종료 상태 = 자연 상태 → 콘텐츠가 숨겨진 채 남지 않는다.
// IntersectionObserver 미지원 시 아무것도 하지 않아 요소는 그대로 보인다.
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.from(entry.target, {
              opacity: 0,
              y: 16,
              duration: 0.5,
              ease: "power2.out",
            });
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
