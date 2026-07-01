"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest } from "@/lib/service";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/useToast";
import { ImageUpload } from "@/components/ui/ImageUpload";
import {
  BookMarked,
  Plus,
  X,
  ChevronRight,
  Lock,
  Globe,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function SeriesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    coverImage: "",
  });

  /* ── Queries ── */
  const { data, isLoading } = useQuery({
    queryKey: ["my-series"],
    queryFn: () => getRequest(`/series?authorId=${user?.id}`),
    enabled: !!user?.id,
  });

  const series = data?.series ?? [];

  /* ── Create mutation ── */
  const createMutation = useMutation({
    mutationFn: () => postRequest("/series", form),
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["my-series"] });
        toast({ title: "Series created!", variant: "success" });
        setForm({ title: "", description: "", coverImage: "" });
        setShowCreate(false);
      } else {
        toast({
          title: data?.message ?? "Failed to create series",
          variant: "destructive",
        });
      }
    },
    onError: () =>
      toast({ title: "Failed to create series", variant: "destructive" }),
  });

  const inputCls =
    "w-full px-3.5 py-2.5 font-body text-sm bg-parchment border border-parchment-dark rounded-xl text-ink placeholder-ink-ghost outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 transition-all";

  return (
    <div className="max-w-4xl mx-auto px-6 py-9">
      {/* Header */}
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-ink tracking-tight">
            Series
          </h1>
          <p className="font-body text-sm text-ink-faint mt-1">
            Organise your posts into ordered collections
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="inline-flex items-center gap-1.5 font-body text-sm font-medium bg-ink text-parchment px-4 py-2 rounded-lg hover:bg-ink-medium transition-all hover:-translate-y-px"
        >
          <Plus size={13} /> New series
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-parchment border border-parchment-dark rounded-2xl p-6 mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">
              Create a series
            </h2>
            <button
              onClick={() => setShowCreate(false)}
              className="text-ink-ghost hover:text-ink transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div>
            <label className="block font-body text-xs font-medium text-ink-faint mb-1.5">
              Series title <span className="text-red-500">*</span>
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. A Study on the Book of Romans"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block font-body text-xs font-medium text-ink-faint mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="What is this series about? Who is it for?"
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>

          <ImageUpload
            value={form.coverImage}
            onChange={(url) => setForm({ ...form, coverImage: url })}
            onClear={() => setForm({ ...form, coverImage: "" })}
            label="Cover image (optional)"
            aspectRatio="video"
          />

          <div className="flex items-center gap-2.5 pt-1">
            <button
              onClick={() => createMutation.mutate()}
              disabled={!form.title.trim() || createMutation.isPending}
              className="inline-flex items-center gap-1.5 font-body text-sm font-medium bg-ink text-parchment px-5 py-2 rounded-lg hover:bg-ink-medium disabled:opacity-50 transition-all"
            >
              {createMutation.isPending && (
                <Loader2 size={13} className="animate-spin" />
              )}
              Create series
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="font-body text-sm text-ink-faint hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Series grid */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-parchment-dark border-t-gold rounded-full animate-spin" />
        </div>
      ) : series.length === 0 ? (
        <div className="text-center py-20 bg-parchment border border-parchment-dark rounded-2xl">
          <BookMarked size={40} className="mx-auto text-parchment-dark mb-4" />
          <p className="font-body text-sm text-ink-ghost mb-3">
            No series yet. Create your first one to organise related posts.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="font-body text-sm text-gold hover:underline"
          >
            Create a series →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {series.map((s: any) => (
            <Link
              key={s.id}
              href={`/series/${s.slug}`}
              className="group bg-parchment border border-parchment-dark rounded-2xl overflow-hidden hover:border-gold-pale hover:shadow-warm-md transition-all"
            >
              {/* Cover */}
              <div className="aspect-video bg-ink overflow-hidden relative">
                {s.coverImage ? (
                  <img
                    src={s.coverImage}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg,transparent,transparent 20px,rgba(184,125,44,0.06) 20px,rgba(184,125,44,0.07) 21px)",
                    }}
                  >
                    <BookMarked size={32} className="text-gold/40" />
                  </div>
                )}
                {/* Published badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span
                    className={cn(
                      "font-body text-[11px] font-medium px-2 py-0.5 rounded-full",
                      s.published
                        ? "bg-emerald-500/90 text-white"
                        : "bg-parchment/90 text-ink-faint",
                    )}
                  >
                    {s.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-display text-[1.0625rem] font-semibold text-ink group-hover:text-gold transition-colors line-clamp-2 leading-snug mb-1.5">
                  {s.title}
                </h3>

                {s.description && (
                  <p className="font-body text-xs text-ink-faint line-clamp-2 leading-relaxed mb-3">
                    {s.description}
                  </p>
                )}

                <div className="flex items-center gap-3 font-body text-xs text-ink-ghost">
                  <span>
                    {s._count?.posts ?? 0} post
                    {s._count?.posts !== 1 ? "s" : ""}
                  </span>
                  {s.community && (
                    <>
                      <span className="text-parchment-dark">·</span>
                      <span className="flex items-center gap-1 text-gold">
                        {s.community.isPrivate ? (
                          <Lock size={9} />
                        ) : (
                          <Globe size={9} />
                        )}
                        {s.community.name}
                      </span>
                    </>
                  )}
                  <span className="ml-auto flex items-center gap-0.5 text-gold group-hover:gap-1.5 transition-all">
                    Manage <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
