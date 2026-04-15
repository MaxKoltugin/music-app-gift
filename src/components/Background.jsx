import React, { useEffect, useRef } from "react";

const Background = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const timeRef = useRef(0);
  const isMobileRef = useRef(window.innerWidth < 768);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const isMobile = window.innerWidth < 768;
    const isSmallMobile = window.innerWidth < 480;
    isMobileRef.current = isMobile;

    const particleCount = isMobile ? 4 : 5;
    let baseRadius;
    let oscillationStrength;
    let blurBase;
    let colorChangeInterval;

    // Адаптивные параметры в зависимости от размера экрана
    if (isSmallMobile) {
      baseRadius = 140;
      oscillationStrength = 15;
      blurBase = 65;
      colorChangeInterval = 8000; // Медленнее меняет цвета на мобилке
    } else if (isMobile) {
      baseRadius = 150;
      oscillationStrength = 18;
      blurBase = 70;
      colorChangeInterval = 8000;
    } else {
      baseRadius = 180;
      oscillationStrength = 25;
      blurBase = 75;
      colorChangeInterval = 6000; // На компе быстрее
    }

    const colorPalettes = [
      { primary: "#ffaa00", secondary: "#ff8800" }, // Золотой
      { primary: "#00ff00", secondary: "#7fff00" }, // Зелёный-лайм
      { primary: "#00ddff", secondary: "#0099ff" }, // Небесно-голубой
      { primary: "#ffaa00", secondary: "#ff8800" }, // Золотой
      { primary: "#ffdd00", secondary: "#ffbb00" }, // Янтарь
      { primary: "#ffaa00", secondary: "#ff8800" }, // Золотой
      
    ];

    const interpolateColor = (color1, color2, factor) => {
      const c1 = parseInt(color1.slice(1), 16);
      const c2 = parseInt(color2.slice(1), 16);

      const r1 = (c1 >> 16) & 255;
      const g1 = (c1 >> 8) & 255;
      const b1 = c1 & 255;

      const r2 = (c2 >> 16) & 255;
      const g2 = (c2 >> 8) & 255;
      const b2 = c2 & 255;

      const r = Math.round(r1 + (r2 - r1) * factor);
      const g = Math.round(g1 + (g2 - g1) * factor);
      const b = Math.round(b1 + (b2 - b1) * factor);

      return `rgb(${r}, ${g}, ${b})`;
    };

    const interpolateColorWithAlpha = (color1, color2, factor, alpha) => {
      const c1 = parseInt(color1.slice(1), 16);
      const c2 = parseInt(color2.slice(1), 16);

      const r1 = (c1 >> 16) & 255;
      const g1 = (c1 >> 8) & 255;
      const b1 = c1 & 255;

      const r2 = (c2 >> 16) & 255;
      const g2 = (c2 >> 8) & 255;
      const b2 = c2 & 255;

      const r = Math.round(r1 + (r2 - r1) * factor);
      const g = Math.round(g1 + (g2 - g1) * factor);
      const b = Math.round(b1 + (b2 - b1) * factor);

      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const getRandomColor = (excludeIndex = -1) => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * colorPalettes.length);
      } while (randomIndex === excludeIndex);
      return colorPalettes[randomIndex];
    };

    particlesRef.current = Array.from({ length: particleCount }, (_, i) => {
      const colorPalette = getRandomColor();
      return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        baseX: canvas.width / 2,
        baseY: canvas.height / 2,
        vx: 0,
        vy: 0,
        radius: baseRadius + i * 35,
        baseRadius: baseRadius + i * 35,
        primaryColor: colorPalette.primary,
        secondaryColor: colorPalette.secondary,
        nextPrimaryColor: colorPalette.primary,
        nextSecondaryColor: colorPalette.secondary,
        duration: 5000 + i * 800,
        oscillationStrength: oscillationStrength,
        blurAmount: blurBase + i * 5,
        mixMode: i === 3 ? "multiply" : "screen",
        colorChangeDuration: 3000,
        colorChangeInterval: colorChangeInterval + Math.random() * 2000,
        lastColorChange: 0,
        colorTransitionProgress: 0,
        currentColorIndex: colorPalettes.indexOf(colorPalette),
      };
    });

    const animate = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      timeRef.current += 16;

      particlesRef.current.forEach((particle, i) => {
        if (
          timeRef.current - particle.lastColorChange >
          particle.colorChangeInterval
        ) {
          const newColor = getRandomColor(particle.currentColorIndex);
          particle.nextPrimaryColor = newColor.primary;
          particle.nextSecondaryColor = newColor.secondary;
          particle.currentColorIndex = colorPalettes.indexOf(newColor);
          particle.lastColorChange = timeRef.current;
          particle.colorChangeInterval =
            colorChangeInterval + Math.random() * 2000;
          particle.colorTransitionProgress = 0;
        }

        if (
          timeRef.current - particle.lastColorChange <
          particle.colorChangeDuration
        ) {
          particle.colorTransitionProgress =
            (timeRef.current - particle.lastColorChange) /
            particle.colorChangeDuration;
        } else {
          particle.primaryColor = particle.nextPrimaryColor;
          particle.secondaryColor = particle.nextSecondaryColor;
          particle.colorTransitionProgress = 1;
        }

        const currentPrimaryColor = interpolateColor(
          particle.primaryColor,
          particle.nextPrimaryColor,
          Math.min(particle.colorTransitionProgress, 1),
        );

        const currentSecondaryColor = interpolateColor(
          particle.secondaryColor,
          particle.nextSecondaryColor,
          Math.min(particle.colorTransitionProgress, 1),
        );

        const progress =
          (timeRef.current % particle.duration) / particle.duration;

        const offsetX =
          Math.sin(progress * Math.PI * 2) *
            particle.oscillationStrength *
            0.7 +
          Math.sin(progress * Math.PI * 2 + i * 0.5) *
            particle.oscillationStrength *
            0.3;

        const offsetY =
          Math.cos(progress * Math.PI * 2) *
            particle.oscillationStrength *
            0.7 +
          Math.cos(progress * Math.PI * 2 + i * 0.7) *
            particle.oscillationStrength *
            0.3;

        particle.x = particle.baseX + offsetX;
        particle.y = particle.baseY + offsetY;

        particle.radius =
          particle.baseRadius *
          (0.92 + Math.sin(progress * Math.PI * 2) * 0.12);

        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius,
        );

        gradient.addColorStop(0, currentPrimaryColor);
        gradient.addColorStop(0.25, currentSecondaryColor);
        gradient.addColorStop(
          0.5,
          interpolateColorWithAlpha(
            particle.primaryColor,
            particle.nextPrimaryColor,
            Math.min(particle.colorTransitionProgress, 1),
            0.8,
          ),
        );
        gradient.addColorStop(
          0.75,
          interpolateColorWithAlpha(
            particle.secondaryColor,
            particle.nextSecondaryColor,
            Math.min(particle.colorTransitionProgress, 1),
            0.4,
          ),
        );
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.globalCompositeOperation = particle.mixMode;
        ctx.filter = `blur(${particle.blurAmount}px)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      ctx.filter = "none";
      ctx.globalCompositeOperation = "source-over";
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const newIsMobile = newWidth < 768;
      const newIsSmallMobile = newWidth < 480;

      canvas.width = newWidth;
      canvas.height = newHeight;

      let newOscillationStrength;
      let newBaseRadius;
      let newBlurBase;
      let newColorChangeInterval;

      if (newIsSmallMobile) {
        newBaseRadius = 140;
        newOscillationStrength = 15;
        newBlurBase = 65;
        newColorChangeInterval = 8000;
      } else if (newIsMobile) {
        newBaseRadius = 150;
        newOscillationStrength = 18;
        newBlurBase = 70;
        newColorChangeInterval = 8000;
      } else {
        newBaseRadius = 180;
        newOscillationStrength = 25;
        newBlurBase = 75;
        newColorChangeInterval = 6000;
      }

      particlesRef.current.forEach((particle, i) => {
        particle.baseX = newWidth / 2;
        particle.baseY = newHeight / 2;
        particle.oscillationStrength = newOscillationStrength;
        particle.baseRadius = newBaseRadius + i * 35;
        particle.radius = particle.baseRadius;
        particle.blurAmount = newBlurBase + i * 5;
        particle.colorChangeInterval =
          newColorChangeInterval + Math.random() * 2000;

        if (newIsMobile !== isMobileRef.current) {
          isMobileRef.current = newIsMobile;
        }
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
};

export default Background;
