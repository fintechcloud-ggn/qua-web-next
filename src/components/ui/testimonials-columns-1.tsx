"use client";
import React from "react";
import { motion } from "motion/react";

export type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
  amount?: string;
  time?: string;
  rating?: number;
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={`overflow-hidden ${props.className ?? ""}`}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-5 pb-5"
      >
        {[...new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role, amount, time, rating }, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-gray-200 max-w-xs w-full backdrop-blur-md transition-all duration-300 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 shadow-sm"
                style={{ background: "rgba(255,255,255,0.85)" }}
              >
                {/* Stars */}
                <div className="text-amber-400 text-xs mb-3">
                  {"⭐".repeat(rating ?? 5)}
                </div>

                {/* Quote text */}
                <p className="text-gray-600 font-medium text-sm leading-relaxed">
                  &ldquo;{text}&rdquo;
                </p>

                {/* Tags */}
                {(amount || time) && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {amount && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/12 text-cyan-400 border border-cyan-500/20">
                        💰 {amount}
                      </span>
                    )}
                    {time && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-500/12 text-green-400 border border-green-500/20">
                        ⚡ {time}
                      </span>
                    )}
                  </div>
                )}

                {/* Author */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  <div className="flex flex-col">
                    <div className="font-bold text-sm text-gray-900 leading-5">{name}</div>
                    <div className="text-[11px] text-gray-500 leading-5 tracking-tight font-medium uppercase">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))]}
      </motion.div>
    </div>
  );
};
