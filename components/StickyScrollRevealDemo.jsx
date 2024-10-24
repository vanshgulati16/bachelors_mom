"use client";
import React from "react";
import { StickyScroll } from "./ui/sticky-scroll-reveal";

export function StickyScrollRevealDemo({ content }) {
  return (
    <div className="p-10">
      <StickyScroll content={content} />
    </div>
  );
}
