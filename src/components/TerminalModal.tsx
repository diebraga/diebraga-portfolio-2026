"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const EMAIL    = "diebraga.developer@gmail.com";
const GITHUB   = "https://github.com/diebraga";
const LINKEDIN = "https://www.linkedin.com/in/diebraga";

interface Line {
  type: "cmd" | "out" | "link" | "blank";
  text: string;
  href?: string;
  icon?: React.ReactNode;
  copyValue?: string;
}

const LINES: Line[] = [
  { type: "blank", text: "" },
  { type: "cmd",  text: "whoami" },
  { type: "out",  text: "Diego Braga — Senior Software Engineer" },
  { type: "blank", text: "" },
  { type: "cmd",  text: "cat contact.json" },
  { type: "out",  text: "{" },
  { type: "link", text: `  "email"`,    href: `mailto:${EMAIL}`,   icon: <MdEmail size={13} />,    copyValue: EMAIL },
  { type: "link", text: `  "github"`,   href: GITHUB,              icon: <FaGithub size={13} /> },
  { type: "link", text: `  "linkedin"`, href: LINKEDIN,            icon: <FaLinkedin size={13} /> },
  { type: "out",  text: "}" },
  { type: "blank", text: "" },
  { type: "cmd",  text: "echo $STATUS" },
  { type: "out",  text: "turning coffee into production code ☕" },
  { type: "blank", text: "" },
];

const CHAR_SPEED = 18;
const LINE_PAUSE = 80;

function TypedLine({ text, onDone }: { text: string; onDone: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const i = useRef(0);

  useEffect(() => {
    if (text === "") { onDone(); return; }
    const id = setInterval(() => {
      i.current++;
      setDisplayed(text.slice(0, i.current));
      if (i.current >= text.length) { clearInterval(id); setTimeout(onDone, LINE_PAUSE); }
    }, CHAR_SPEED);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <span>{displayed}</span>;
}

export default function TerminalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [copied, setCopied]             = useState(false);
  const bottomRef                       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setVisibleCount(0);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleCount]);

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent
        className="p-0 border-0 bg-transparent shadow-none !max-w-[600px] w-[95vw]"
        style={{ outline: "none" }}
        showCloseButton={false}
      >
        {/* visually hidden title for accessibility */}
        <DialogTitle className="sr-only">Contact Terminal</DialogTitle>

        <div
          className="w-full rounded-xl overflow-hidden"
          style={{
            background: "rgba(8,4,20,0.98)",
            border: "1px solid rgba(168,85,247,0.4)",
            boxShadow: "0 0 0 1px rgba(168,85,247,0.15), 0 32px 80px rgba(0,0,0,0.9), 0 0 60px rgba(88,28,135,0.25)",
          }}
        >
          {/* title bar */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid rgba(168,85,247,0.2)", background: "rgba(20,8,40,0.95)" }}
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={onClose} />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-purple-400/70 font-mono">diebraga — contact.sh</span>
            <div className="w-12" />
          </div>

          {/* terminal body */}
          <div className="px-5 py-4 font-mono text-sm min-h-[260px] max-h-[55vh] overflow-y-auto">
            {LINES.slice(0, visibleCount).map((line, i) => {
              if (line.type === "blank") return <div key={i} className="h-3" />;

              if (line.type === "cmd") return (
                <div key={i} className="flex items-center gap-1.5 mb-1">
                  <span style={{ color: "rgb(168,85,247)" }}>❯</span>
                  <span className="text-purple-300">{line.text}</span>
                </div>
              );

              if (line.type === "link") return (
                <div key={i} className="flex items-center gap-2 mb-0.5 group pl-2">
                  <span style={{ color: "rgb(134,239,172)" }}>{line.text}:</span>
                  <a
                    href={line.href}
                    target={line.href?.startsWith("mailto") ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline transition-colors flex items-center gap-1.5"
                  >
                    {line.icon}
                    <span>
                      {line.href?.startsWith("mailto") ? EMAIL
                        : line.href?.includes("github") ? GITHUB
                        : LINKEDIN}
                    </span>
                  </a>
                  {line.copyValue && (
                    <button
                      onClick={() => handleCopy(line.copyValue!)}
                      className="opacity-0 group-hover:opacity-100 text-[10px] text-gray-500 hover:text-purple-400 transition-all ml-1 border border-gray-700 hover:border-purple-600 px-1.5 py-0.5 rounded"
                    >
                      {copied ? "copied!" : "copy"}
                    </button>
                  )}
                </div>
              );

              return (
                <div key={i} className="mb-0.5 pl-2" style={{ color: "rgb(209,213,219)" }}>
                  {line.text}
                </div>
              );
            })}

            {visibleCount < LINES.length && (
              <TypedLine
                key={visibleCount}
                text={LINES[visibleCount].text}
                onDone={() => setVisibleCount((n) => n + 1)}
              />
            )}

            {visibleCount >= LINES.length && (
              <div className="flex items-center gap-1.5 mt-2">
                <span style={{ color: "rgb(168,85,247)" }}>❯</span>
                <span className="animate-[pulse_1s_infinite] text-purple-400">█</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* copied toast */}
        <AnimatePresence>
          {copied && (
            <motion.div
              className="absolute bottom-[-3rem] left-1/2 -translate-x-1/2 bg-purple-900/90 text-purple-100 text-xs font-mono px-4 py-2 rounded-full border border-purple-600/50 whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              📋 Email copied to clipboard
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
