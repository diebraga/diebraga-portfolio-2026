"use client";

import { cn } from "@/lib/utils";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BentoGridProps {
  className?: string;
  children: React.ReactNode;
}

export const BentoGrid = ({ className, children }: BentoGridProps) => (
  <div
    className={cn(
      "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto mt-14",
      className
    )}
  >
    {children}
  </div>
);

interface BentoGridItemProps {
  className?: string;
  title: string;
  description: string;
  header: string;
  link: string;
  tags: string[];
  live?: string;
}

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  link,
  tags,
  live,
}: BentoGridItemProps) => (
  <div
    className={cn(
      "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-none p-4 text-white bg-black border-white/[0.2] border justify-between flex flex-col space-y-4",
      className
    )}
  >
    <div className="overflow-hidden rounded-lg h-96">
      <img className="object-cover w-full h-full" src={header} alt={title} />
    </div>
    <div className="group-hover/bento:translate-x-2 transition duration-200">
      <div className="font-sans font-bold mb-2 mt-2">{title}</div>
      <div className="font-sans font-normal text-xs text-gray-400">{description}</div>
      <div className="mt-1 flex flex-wrap gap-2 text-xs">
        {tags.map((tag, i) => (
          <Badge key={i} variant="secondary" className="bg-purple-900/40 text-purple-200 border border-purple-700/50">
            #{tag}
          </Badge>
        ))}
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <Button
        onClick={() => window.open(link, "_blank")}
        className="w-full flex items-center gap-2 justify-center bg-purple-900/60 hover:bg-purple-800 text-white border border-purple-700/50"
        variant="outline"
      >
        View on GitHub
        <FaGithub className="text-lg" />
      </Button>
      {live && (
        <a
          href={live}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 text-xs text-center"
        >
          Live Demo →
        </a>
      )}
    </div>
  </div>
);
