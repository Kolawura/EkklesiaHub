import { cn } from "@/lib/utils";
import { ImageUpload } from "../ui/ImageUpload";
import { Community } from "@/lib/type";
import { useCommunitySettings } from "@/hooks/useCommunitySettings";

export function CommunitySettings({
  community,
  onSaved,
  id,
}: {
  community: Community;
  onSaved: () => void;
  id: string;
}) {
  const { form, setForm, updateCommunity, pending } = useCommunitySettings(
    community,
    onSaved,
    id,
  );

  const field = (label: string, children: React.ReactNode) => (
    <div>
      <label className="block font-body text-xs font-medium text-ink-faint mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );

  const inputCls =
    "w-full px-3.5 py-2.5 font-body text-sm bg-parchment border border-parchment-dark rounded-xl text-ink outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 transition-all";

  return (
    <div className="max-w-2xl space-y-4">
      <div className="bg-parchment border border-parchment-dark rounded-2xl p-6 space-y-5">
        <h3 className="font-display text-[1.0625rem] font-semibold text-ink">
          Community settings
        </h3>

        {field(
          "Name",
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputCls}
          />,
        )}

        {field(
          "Description",
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className={`${inputCls} resize-none`}
          />,
        )}

        {field(
          "Community rules",
          <textarea
            value={form.rules}
            onChange={(e) => setForm({ ...form, rules: e.target.value })}
            rows={4}
            placeholder="List your community guidelines here…"
            className={`${inputCls} resize-none`}
          />,
        )}

        <ImageUpload
          value={form.avatar}
          onChange={(url) => setForm({ ...form, avatar: url })}
          onClear={() => setForm({ ...form, avatar: "" })}
          label="Community avatar"
          aspectRatio="square"
        />

        <ImageUpload
          value={form.coverImage}
          onChange={(url) => setForm({ ...form, coverImage: url })}
          onClear={() => setForm({ ...form, coverImage: "" })}
          label="Cover image"
          aspectRatio="banner"
        />

        {/* Privacy toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-parchment-dark">
          <div>
            <p className="font-body text-sm font-medium text-ink">
              Private community
            </p>
            <p className="font-body text-xs text-ink-ghost mt-0.5">
              Only members can see posts and the members list
            </p>
          </div>
          <button
            onClick={() => setForm({ ...form, isPrivate: !form.isPrivate })}
            className={cn(
              "relative w-10 h-5.5 rounded-full transition-colors",
              form.isPrivate ? "bg-gold" : "bg-parchment-dark",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-parchment shadow-sm transition-transform",
                form.isPrivate ? "translate-x-4.5" : "",
              )}
            />
          </button>
        </div>

        <button
          onClick={() => updateCommunity()}
          disabled={pending}
          className="inline-flex items-center gap-1.5 font-body text-sm font-medium bg-ink text-parchment px-5 py-2 rounded-lg hover:bg-ink-medium disabled:opacity-50 transition-all"
        >
          {pending && (
            <span className="w-3.5 h-3.5 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
          )}
          Save changes
        </button>
      </div>
    </div>
  );
}
