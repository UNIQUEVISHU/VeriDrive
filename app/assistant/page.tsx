"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { useFleetContext } from "@/app/providers";
import { Topbar } from "@/components/dashboard/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/primitives";
import { assistantReply } from "@/lib/simulate";

interface Msg {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = [
  "Which vehicle is critical right now?",
  "How's the fleet battery health?",
  "Give me a fleet summary",
  "What about brake wear?",
];

export default function AssistantPage() {
  const { vehicles } = useFleetContext();
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "I'm your edge AI maintenance assistant. I read live health scores, RUL estimates, and anomaly flags across the fleet. Ask me anything.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = assistantReply(text, vehicles);
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
      setTyping(false);
    }, 700);
  }

  return (
    <div className="flex h-screen flex-col">
      <Topbar title="AI Maintenance Assistant" subtitle="LLM-powered explanations grounded in live fleet telemetry" />

      <div className="flex flex-1 flex-col gap-6 overflow-hidden px-6 py-6 lg:flex-row lg:px-10">
        <Card className="flex flex-1 flex-col overflow-hidden">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${m.role === "user" ? "justify-end" : ""}`}
              >
                {m.role === "assistant" && (
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-teal-400/10 text-teal-300">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-teal-400 text-neutral-950"
                      : "border border-white/10 bg-white/[0.03] text-neutral-200"
                  }`}
                >
                  {m.text}
                </div>
                {m.role === "user" && (
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-white/10 text-neutral-300">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            ))}
            <AnimatePresence>
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-teal-400/10 text-teal-300">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-neutral-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: d * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-neutral-400 transition-colors hover:border-teal-400/30 hover:text-teal-300"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a vehicle, component, or the fleet..."
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>

        <Card className="w-full flex-none p-5 lg:w-80">
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-200">
            <Sparkles className="h-4 w-4 text-teal-300" /> How this works
          </div>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500">
            The assistant reads structured outputs from the edge inference engine — health
            scores, RUL, and failure probabilities — and turns them into plain-language
            guidance. In production this connects to an LLM via the Anthropic API for richer,
            open-ended explanations.
          </p>
          <div className="mt-4 space-y-2">
            {vehicles.slice(0, 5).map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2 text-xs">
                <span className="text-neutral-400">{v.name}</span>
                <span
                  className={
                    v.severity === "critical"
                      ? "text-red-300"
                      : v.severity === "warning"
                      ? "text-amber-300"
                      : "text-teal-300"
                  }
                >
                  {v.healthScore}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
