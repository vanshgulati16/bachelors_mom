"use client";;
import { DirectionAwareHover } from "./ui/direction-aware-hover";

export function DirectionHoverMixMatch() {
  const imageUrl = "/img/mix&match.png"
  return (
    (<div className="h-[40rem] w-[40rem] relative  flex items-center justify-center">
      <DirectionAwareHover imageUrl={imageUrl}>
        <p className="font-bold text-xl">Mix & Match</p>
        <p className="font-normal text-sm">Discover new recipe possibilities with our Mix & Match feature</p>
      </DirectionAwareHover>
    </div>)
  );
}

export function DirectionHoverWeeklyPlanner() {
    const imageUrl = "/img/weeklyplanner.png"
    return (
      (<div className="h-[40rem] relative  flex items-center justify-center">
        <DirectionAwareHover imageUrl={imageUrl}>
          <p className="font-bold text-xl">Weekly Planner</p>
          <p className="font-normal text-sm">Organize your week with our intuitive Weekly Planner</p>
        </DirectionAwareHover>
      </div>)
    );
  }
  
