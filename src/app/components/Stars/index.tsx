"use client"
import React, { use, useEffect, useRef } from "react";

interface StarsProps {
  numOfStars: number;
}

class Star {
  x: number;
  y: number;
  radius: number;
  velocity: number;
  context: CanvasRenderingContext2D | null;
  canvas: HTMLCanvasElement;

  constructor(
    x: number,
    y: number,
    radius: number,
    velocity: number,
    canvas: HTMLCanvasElement
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  }

  public draw() {
    const { context } = this;

    if (!context) {
      return console.log("Star context is null.");
    }

    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = '#FFF';
    context.fill();
  }

  public update() {
    this.y += this.velocity;
    this.x += this.velocity;
    if (this.y > this.canvas.height) {
      this.y = 0 - this.radius;
      this.x = Math.random() * this.canvas.width;
    }
    this.draw();
  }
}

export default function Stars({
  numOfStars
}: StarsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const starsArr: Star[] = [];

    for (let i = 0; i < numOfStars; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 1.5;
      const velocity = Math.random() * 0.35 + 0.1;
      starsArr.push(new Star(x, y, radius, velocity, canvas));
    }

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      starsArr.forEach((star) => star.update());
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [numOfStars]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none select-none"
    />
  );
}