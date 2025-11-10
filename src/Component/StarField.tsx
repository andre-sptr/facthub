import { useEffect, useRef, useState } from "react";

const StarField = () => {
  const starsRef = useRef<HTMLDivElement>(null);
  const planetsRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const starsContainer = starsRef.current;
    const planetsContainer = planetsRef.current;
    if (!starsContainer || !planetsContainer) return;

    // Clear existing content
    starsContainer.innerHTML = "";
    planetsContainer.innerHTML = "";

    // Generate 150 floating particles (leaves, petals, dust)
    for (let i = 0; i < 150; i++) {
      const particle = document.createElement("div");
      const size = Math.random() > 0.7 ? 4 : 3;
      particle.className = "particle";
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 200}%`;
      particle.style.animationDelay = `${Math.random() * 4}s`;
      particle.style.animationDuration = `${3 + Math.random() * 5}s`;
      particle.style.opacity = `${0.3 + Math.random() * 0.5}`;
      starsContainer.appendChild(particle);
    }

    // Generate nature elements
    const natureElements = [
      { emoji: "🌿", size: 70, left: 12, top: 15, speed: 0.04 },
      { emoji: "🍃", size: 55, left: 78, top: 25, speed: 0.07 },
      { emoji: "🦋", size: 45, left: 88, top: 65, speed: 0.05 },
      { emoji: "🌸", size: 50, left: 25, top: 75, speed: 0.09 },
      { emoji: "🌾", size: 60, left: 55, top: 45, speed: 0.06 },
      { emoji: "🍂", size: 40, left: 8, top: 55, speed: 0.08 },
      { emoji: "🌻", size: 48, left: 92, top: 35, speed: 0.06 },
      { emoji: "🪴", size: 52, left: 15, top: 85, speed: 0.05 },
    ];

    natureElements.forEach((element) => {
      const elementDiv = document.createElement("div");
      elementDiv.className = "nature-element";
      elementDiv.textContent = element.emoji;
      elementDiv.style.fontSize = `${element.size}px`;
      elementDiv.style.left = `${element.left}%`;
      elementDiv.style.top = `${element.top}%`;
      elementDiv.dataset.speed = element.speed.toString();
      planetsContainer.appendChild(elementDiv);
    });
  }, []);

  // Apply parallax effect
  useEffect(() => {
    const starsContainer = starsRef.current;
    const planetsContainer = planetsRef.current;
    if (!starsContainer || !planetsContainer) return;

    // Particles move slower (parallax effect)
    starsContainer.style.transform = `translateY(${scrollY * 0.3}px)`;

    // Nature elements move at different speeds
    const elements = planetsContainer.querySelectorAll(".nature-element");
    elements.forEach((element) => {
      const speed = parseFloat((element as HTMLElement).dataset.speed || "0.05");
      (element as HTMLElement).style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, [scrollY]);

  return (
    <>
      <div
        ref={starsRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ height: "200vh" }}
        aria-hidden="true"
      />
      <div
        ref={planetsRef}
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
      />
    </>
  );
};

export default StarField;
