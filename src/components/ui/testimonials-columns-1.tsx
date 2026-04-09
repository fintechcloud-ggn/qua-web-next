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
                className="p-6 rounded-2xl border border-orange-200/70 max-w-xs w-full backdrop-blur-md transition-all duration-300 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5 shadow-sm"
                style={{ background: "rgba(255,251,247,0.82)" }}
              >
                {/* Stars */}
                <div className="text-orange-500 text-xs mb-3">
                  {"⭐".repeat(rating ?? 5)}
                </div>

                {/* Quote text */}
                <p className="text-[#6f4317] font-medium text-sm leading-relaxed">
                  &ldquo;{text}&rdquo;
                </p>

                {/* Tags */}
                {(amount || time) && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {amount && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                        💰 {amount}
                      </span>
                    )}
                    {time && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        ⚡ {time}
                      </span>
                    )}
                  </div>
                )}

                {/* Author */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-orange-100">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-orange-100"
                  />
                  <div className="flex flex-col">
                    <div className="font-bold text-sm text-slate-950 leading-5">{name}</div>
                    <div className="text-[11px] text-[#8a5a24] leading-5 tracking-tight font-medium uppercase">{role}</div>
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
