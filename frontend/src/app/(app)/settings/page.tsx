"use client";
import { useAuth } from "@/hooks/useAuth";
import { AlertTriangle } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { PasswordInput } from "@/components/Settings/PasswordInput";
import { SectionCard } from "@/components/Settings/SectionCard";

export default function SettingsPage() {
  const { user } = useAuth();
  const {
    pwForm,
    setPwForm,
    emailForm,
    setEmailForm,
    confirmDelete,
    setConfirmDelete,
    deletePassword,
    setDeletePassword,
    handleChangeEmail,
    handleChangePassword,
    changeEmailMutation,
    changePwMutation,
    deleteAccountMutation,
  } = useSettings();

  const submitBtn = (label: string, pending: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center gap-2 font-body text-sm font-medium bg-ink text-parchment px-5 py-2 rounded-lg hover:bg-ink-medium disabled:opacity-50 transition-all"
    >
      {pending && (
        <span className="w-3.5 h-3.5 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
      )}
      {label}
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-9">
      <div className="mb-8">
        <h1 className="font-display text-[2rem] font-bold text-ink tracking-tight">
          Settings
        </h1>
        <p className="font-body text-sm text-ink-faint mt-1">
          Manage your account security and preferences.
        </p>
      </div>

      <div className="space-y-5">
        {/* Change password */}
        <SectionCard
          title="Change password"
          description="Use a strong password — uppercase, numbers, and symbols."
        >
          <div className="space-y-4">
            <PasswordInput
              label="Current password"
              name="current"
              value={pwForm.current}
              onChange={(v) => setPwForm({ ...pwForm, current: v })}
            />
            <PasswordInput
              label="New password"
              name="next"
              value={pwForm.next}
              onChange={(v) => setPwForm({ ...pwForm, next: v })}
            />
            <PasswordInput
              label="Confirm new password"
              name="confirm"
              value={pwForm.confirm}
              onChange={(v) => setPwForm({ ...pwForm, confirm: v })}
            />
            {submitBtn(
              "Update password",
              changePwMutation.isPending,
              handleChangePassword,
            )}
          </div>
        </SectionCard>

        {/* Change email */}
        <SectionCard
          title="Change email"
          description={`Your current email is ${user?.email ?? "—"}.`}
        >
          <div className="space-y-4">
            <div>
              <label className="block font-body text-xs font-medium text-ink-faint mb-1.5">
                New email address
              </label>
              <input
                type="email"
                value={emailForm.newEmail}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, newEmail: e.target.value })
                }
                placeholder="new@example.com"
                className="w-full px-3.5 py-2.5 font-body text-sm bg-parchment border border-parchment-dark rounded-lg text-ink placeholder-ink-ghost outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 transition-all"
              />
            </div>
            <PasswordInput
              label="Confirm with your password"
              name="email-password"
              value={emailForm.password}
              onChange={(v) => setEmailForm({ ...emailForm, password: v })}
            />
            {submitBtn(
              "Update email",
              changeEmailMutation.isPending,
              handleChangeEmail,
            )}
          </div>
        </SectionCard>

        {/* Danger zone */}
        <SectionCard
          title="Danger zone"
          description="These actions are permanent and cannot be undone."
        >
          <div className="border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle
                size={16}
                className="text-red-500 shrink-0 mt-0.5"
              />
              <div>
                <p className="font-body text-sm font-medium text-ink">
                  Delete account
                </p>
                <p className="font-body text-xs text-ink-faint mt-0.5">
                  All your posts, drafts, and data will be permanently deleted.
                </p>
              </div>
            </div>

            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="font-body text-sm text-red-600 border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete my account
              </button>
            ) : (
              <div className="space-y-3">
                <PasswordInput
                  label="Enter your password to confirm"
                  name="delete-password"
                  value={deletePassword}
                  onChange={setDeletePassword}
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => deleteAccountMutation.mutate()}
                    disabled={deleteAccountMutation.isPending}
                    className="inline-flex items-center gap-1.5 font-body text-sm font-medium bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {deleteAccountMutation.isPending && (
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Yes, delete permanently
                  </button>
                  <button
                    onClick={() => {
                      setConfirmDelete(false);
                      setDeletePassword("");
                    }}
                    className="font-body text-sm text-ink-faint hover:text-ink transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
