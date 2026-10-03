import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  glow: string;
}

export const InteractiveHorrorCanvas: React.FC<{ isNightmare: boolean }> = ({ isNightmare }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const count = isNightmare ? 65 : 35;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.8 + 0.8,
        speedY: -(Math.random() * 0.7 + 0.2),
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.7 + 0.2,
        glow: isNightmare ? '#ef4444' : '#991b1b',
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Mouse reactive atmospheric vignette
      const grad = ctx.createRadialGradient(
        mouseX,
        mouseY,
        50,
        mouseX,
        mouseY,
        width * 0.75
      );
      if (isNightmare) {
        grad.addColorStop(0, 'rgba(185, 28, 28, 0.15)');
        grad.addColorStop(0.5, 'rgba(69, 10, 10, 0.08)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
      } else {
        grad.addColorStop(0, 'rgba(127, 29, 29, 0.06)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render floating dark embers
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        // Subtle parallax toward mouse
        const dx = (mouseX - p.x) * 0.0008;
        p.x += dx;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isNightmare ? `rgba(239, 68, 68, ${p.opacity})` : `rgba(185, 28, 28, ${p.opacity * 0.7})`;
        ctx.shadowColor = p.glow;
        ctx.shadowBlur = isNightmare ? 12 : 6;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isNightmare]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};
