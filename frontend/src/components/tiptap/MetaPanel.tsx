import { Community } from "@/lib/type";
import { cn } from "@/lib/utils";
import { ImagePlus, ChevronDown, Users, X, Tag } from "lucide-react";
import { useState, useRef } from "react";
import { ImageUpload } from "../ui/ImageUpload";

export function MetaPanel({
  communities,
  allTags,
  selectedCommunity,
  onSelectCommunity,
  selectedTags,
  onSelectTag,
  onRemoveTag,
  coverImage,
  onCoverChange,
  onCoverClear,
}: {
  communities: Community[];
  allTags: { id: string; name: string }[];
  selectedCommunity: Community | null;
  onSelectCommunity: (c: Community | null) => void;
  selectedTags: { id: string; name: string }[];
  onSelectTag: (t: { id: string; name: string }) => void;
  onRemoveTag: (id: string) => void;
  coverImage: string;
  onCoverChange: (url: string) => void;
  onCoverClear: () => void;
}) {
  const [tagInput, setTagInput] = useState("");
  const [showCommunities, setShowCommunities] = useState(false);
  const [showCover, setShowCover] = useState(false);
  const commRef = useRef<HTMLDivElement>(null);

  const filteredTags = allTags.filter(
    (t) =>
      t.name.toLowerCase().includes(tagInput.toLowerCase()) &&
      !selectedTags.find((s) => s.id === t.id),
  );

  const sectionHd = (label: string) => (
    <p className="font-body text-[10px] uppercase tracking-widest text-ink-ghost font-medium mb-2">
      {label}
    </p>
  );

  return (
    <div className="space-y-6">
      {/* Cover image */}
      <div>
        <button
          onClick={() => setShowCover(!showCover)}
          className="flex items-center gap-2 w-full text-left group"
        >
          <div className="w-6 h-6 rounded-md bg-parchment-dark flex items-center justify-center text-ink-ghost group-hover:bg-gold-bg group-hover:text-gold group-hover:border group-hover:border-gold-pale transition-all">
            <ImagePlus size={12} />
          </div>
          <span className="font-body text-sm text-ink-faint group-hover:text-ink transition-colors">
            {coverImage ? "Change cover" : "Add cover image"}
          </span>
          <ChevronDown
            size={12}
            className={cn(
              "ml-auto text-ink-ghost transition-transform",
              showCover ? "rotate-180" : "",
            )}
          />
        </button>
        {showCover && (
          <div className="mt-3">
            <ImageUpload
              value={coverImage}
              onChange={onCoverChange}
              onClear={onCoverClear}
              label=""
              aspectRatio="video"
            />
          </div>
        )}
      </div>

      <div className="h-px bg-parchment-dark" />

      {/* Community */}
      <div ref={commRef}>
        {sectionHd("Community")}
        <div className="relative">
          <button
            onClick={() => setShowCommunities(!showCommunities)}
            className={cn(
              "w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border font-body text-sm transition-all text-left",
              selectedCommunity
                ? "border-gold-pale bg-gold-bg text-ink"
                : "border-parchment-dark text-ink-faint hover:border-ink-ghost hover:text-ink",
            )}
          >
            <Users
              size={13}
              className={selectedCommunity ? "text-gold" : "text-ink-ghost"}
            />
            <span className="flex-1 truncate">
              {selectedCommunity?.name ?? "No community (public)"}
            </span>
            {selectedCommunity ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCommunity(null);
                }}
                className="text-ink-ghost hover:text-ink ml-auto transition-colors"
              >
                <X size={12} />
              </button>
            ) : (
              <ChevronDown size={12} className="text-ink-ghost ml-auto" />
            )}
          </button>

          {showCommunities && (
            <div className="absolute top-full mt-1.5 left-0 right-0 bg-parchment border border-parchment-dark rounded-xl shadow-warm-md z-20 overflow-hidden">
              <button
                onClick={() => {
                  onSelectCommunity(null);
                  setShowCommunities(false);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 font-body text-sm text-ink-faint hover:bg-parchment-deep transition-colors"
              >
                <span className="w-6 h-6 rounded-md bg-parchment-dark flex items-center justify-center text-ink-ghost text-xs">
                  –
                </span>
                Public (no community)
              </button>
              {communities.length > 0 && (
                <div className="border-t border-parchment-deep">
                  {communities.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectCommunity(c);
                        setShowCommunities(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 font-body text-sm text-ink hover:bg-parchment-deep transition-colors"
                    >
                      <span className="w-6 h-6 rounded-md bg-gold-bg border border-gold-pale flex items-center justify-center font-display text-[9px] font-bold text-gold">
                        {c.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{c.name}</p>
                        <p className="text-[11px] text-ink-ghost">
                          {c.memberRole === "ADMIN"
                            ? "Admin"
                            : c.memberRole === "CURATED_WRITER"
                              ? "Writer"
                              : "Member"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-parchment-dark" />

      {/* Tags */}
      <div>
        {sectionHd("Tags")}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {selectedTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 font-body text-[11px] font-medium px-2.5 py-1 bg-gold-bg text-gold border border-gold-pale rounded-full"
              >
                {tag.name}
                <button
                  onClick={() => onRemoveTag(tag.id)}
                  className="text-gold/60 hover:text-gold transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="relative">
          <Tag
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost pointer-events-none"
          />
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Search tags…"
            className="w-full pl-8 pr-3 py-2.5 font-body text-sm bg-parchment border border-parchment-dark rounded-xl text-ink placeholder-ink-ghost outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 transition-all"
          />
          {tagInput && filteredTags.length > 0 && (
            <div className="absolute top-full mt-1.5 left-0 right-0 bg-parchment border border-parchment-dark rounded-xl shadow-warm-md z-20 overflow-hidden max-h-40 overflow-y-auto">
              {filteredTags.slice(0, 8).map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => {
                    onSelectTag(tag);
                    setTagInput("");
                  }}
                  className="w-full text-left px-3.5 py-2 font-body text-sm text-ink hover:bg-parchment-deep transition-colors"
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="font-body text-[11px] text-ink-ghost mt-2">
          Up to 5 tags.
        </p>
      </div>
    </div>
  );
}
