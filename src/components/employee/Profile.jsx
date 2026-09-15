import { FaTimes, FaUser } from "react-icons/fa";

const Profile = ({
  isOpen,
  onClose,
  editData,
  handleEditChange,
  handleSaveEdit,
  editError,
  isSaving,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6">
      {/* Modal */}
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl themed-bg-card themed-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-5"
          style={{
            background: "var(--card-bg)",
            borderBottom: "1px solid var(--muted)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                background: "var(--section-bg)",
                color: "var(--text-primary)",
              }}
            >
              <FaUser className="text-sm" />
            </div>

            <div>
              <h2 className="text-lg font-semibold themed-text">
                Edit Profile
              </h2>

              <p className="text-xs themed-muted">
                Update your personal information
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              color: "var(--muted)",
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSaveEdit}
          className="space-y-5 p-6 themed-bg-card themed-text"
        >
          <div className="grid gap-4 sm:grid-cols-2">

            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold themed-muted">
                First Name
              </label>

              <input
                name="firstname"
                value={editData.firstname || ""}
                onChange={handleEditChange}
                required
                className="mt-2 w-full rounded-lg px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-amber-500/30 themed-bg-card themed-text"
                style={{
                  border: "1px solid var(--muted)",
                }}
              />
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-sm font-semibold themed-muted">
                Middle Name
              </label>

              <input
                name="middlename"
                value={editData.middlename || ""}
                onChange={handleEditChange}
                className="mt-2 w-full rounded-lg px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-amber-500/30 themed-bg-card themed-text"
                style={{
                  border: "1px solid var(--muted)",
                }}
              />
            </div>

            {/* Last Name */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold themed-muted">
                Last Name
              </label>

              <input
                name="lastname"
                value={editData.lastname || ""}
                onChange={handleEditChange}
                required
                className="mt-2 w-full rounded-lg px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-amber-500/30 themed-bg-card themed-text"
                style={{
                  border: "1px solid var(--muted)",
                }}
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold themed-muted">
                Address
              </label>

              <input
                name="address"
                value={editData.address || ""}
                onChange={handleEditChange}
                className="mt-2 w-full rounded-lg px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-amber-500/30"
                style={{
                  border: "1px solid var(--muted)",
                  background: "var(--card-bg)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-semibold themed-muted">
                Mobile Number
              </label>

              <input
                name="phone1"
                value={editData.phone1 || ""}
                onChange={handleEditChange}
                className="mt-2 w-full rounded-lg px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-amber-500/30 themed-bg-card themed-text"
                style={{
                  border: "1px solid var(--muted)",
                }}
              />
            </div>

            {/* Telephone Number */}
            <div>
              <label className="block text-sm font-semibold themed-muted">
                Telephone Number
              </label>

              <input
                name="phone2"
                value={editData.phone2 || ""}
                onChange={handleEditChange}
                className="mt-2 w-full rounded-lg px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-amber-500/30 themed-bg-card themed-text"
                style={{
                  border: "1px solid var(--muted)",
                }}
              />
            </div>
          </div>

          {/* Error */}
          {editError && (
            <div
              className="rounded-lg px-4 py-3 text-sm"
              style={{
                border: "1px solid #fecaca",
                background: "#fff6f6",
                color: "#7f1d1d",
              }}
            >
              {editError}
            </div>
          )}

          {/* Footer */}
          <div
            className="flex flex-col gap-3 pt-5 sm:flex-row sm:justify-end"
            style={{
              borderTop: "1px solid var(--muted)",
            }}
          >
            {/* Cancel */}
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                border: "1px solid var(--muted)",
                background: "var(--card-bg)",
                color: "var(--text-primary)",
              }}
            >
              Cancel
            </button>

            {/* Save */}
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;