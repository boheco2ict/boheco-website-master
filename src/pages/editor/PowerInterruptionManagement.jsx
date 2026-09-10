import { useEffect, useRef, useState } from "react";
import {
  FaBolt,
  FaEdit,
  FaImage,
  FaPlus,
  FaTrash,
  FaUpload,
  FaTimes,
  FaSave,
  FaCalendarCheck,
  FaCalendarTimes,
} from "react-icons/fa";
import { getPowerInterruption } from "../../services/getservices";
import { deletePowerInterruption } from "../../services/deleteservices";
import { createPowerInterruption } from "../../services/postservices";
import { updatePowerInterruption } from "../../services/updateservices";
import {
  uploadStorageImage,
  deleteStorageImage,
} from "../../services/storageservices";

const BUCKET_NAME = "WEBSITE ASSETS";
const STORAGE_FOLDER = "POWER/INTERRUPTION";
const TYPE_OPTIONS = [
  { value: "schedule", label: "Schedule" },
  { value: "unschedule", label: "Unschedule" },
];

const PowerInterruptionManagement = () => {
  const [powerInterruptions, setPowerInterruptions] = useState({
    schedule: [],
    unschedule: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingInterruption, setEditingInterruption] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("schedule");
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadInterruptions();
  }, []);

  const loadInterruptions = async () => {
    try {
      setLoading(true);
      const data = await getPowerInterruption();
      setPowerInterruptions(data || { schedule: [], unschedule: [] });
    } catch (error) {
      console.error("Error loading power interruptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingInterruption(null);
    setSelectedFile(null);
    setPreviewUrl("");
    setDescription("");
    setType("schedule");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (interruption) => {
    setEditingInterruption(interruption);
    setSelectedFile(null);
    setPreviewUrl(interruption.image_url || "");
    setDescription(interruption.description || "");
    setType(interruption.type || "");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (saving) return;
    setShowModal(false);
    resetForm();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must not exceed 10MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    let uploadedImageUrl = null;
    const cleanDescription = description.trim();

    try {
      setSaving(true);

      if (!cleanDescription) {
        alert("Please enter a description.");
        return;
      }

      if (!editingInterruption) {
        // ADD
        if (!selectedFile) {
          alert("Please select an interruption image.");
          return;
        }

        // Upload image
        try {
          uploadedImageUrl = await uploadStorageImage({
            file: selectedFile,
            bucket: BUCKET_NAME,
            folder: STORAGE_FOLDER,
            prefix: "PI",
          });
        } catch (error) {
          console.error("Error uploading interruption image:", error);
          alert("Failed to upload the image. Please try again.");
          return;
        }

        if (!uploadedImageUrl) {
          alert("Failed to upload the image. Please try again.");
          return;
        }

        const createInterruption = await createPowerInterruption(
          uploadedImageUrl,
          cleanDescription,
          type
        );

        if (!createInterruption) {
          // Delete uploaded image if database creation fails
          try {
            await deleteStorageImage(
              uploadedImageUrl,
              BUCKET_NAME
            );
            uploadedImageUrl = null;
          } catch (error) {
            console.error(
              "Error deleting uploaded image after failed creation:",
              error
            );
          }

          alert("Failed to add the power interruption. Please try again.");
          return;
        }

        uploadedImageUrl = null;

        alert("Power Interruption Added Successfully.");
      } else {
        // UPDATE
        let imageUrl = editingInterruption.image_url || null;

        if (selectedFile) {
          // Upload new image
          try {
            uploadedImageUrl = await uploadStorageImage({
              file: selectedFile,
              bucket: BUCKET_NAME,
              folder: STORAGE_FOLDER,
              prefix: "PI",
            });
          } catch (error) {
            console.error("Error uploading new interruption image:", error);
            alert("Failed to upload the image. Please try again.");
            return;
          }

          if (!uploadedImageUrl) {
            alert("Failed to upload the image. Please try again.");
            return;
          }

          imageUrl = uploadedImageUrl;
        }

        const updateInterruption = await updatePowerInterruption(
          editingInterruption.id,
          imageUrl,
          cleanDescription,
          type
        );

        if (!updateInterruption) {
          // Delete newly uploaded image if database update fails
          if (uploadedImageUrl) {
            try {
              await deleteStorageImage(
                uploadedImageUrl,
                BUCKET_NAME
              );
              uploadedImageUrl = null;
            } catch (error) {
              console.error(
                "Error deleting uploaded image after failed update:",
                error
              );
            }
          }

          alert("Failed to update the power interruption. Please try again.");
          return;
        }

        // Delete old image only after successful database update
        if (selectedFile && editingInterruption.image_url) {
          try {
            await deleteStorageImage(
              editingInterruption.image_url,
              BUCKET_NAME
            );
          } catch (error) {
            console.error("Error deleting old interruption image:", error);
          }
        }

        uploadedImageUrl = null;

        alert("Power Interruption Updated Successfully.");
      }

      await loadInterruptions();

      setTimeout(() => {
        setShowModal(false);
        resetForm();
      }, 800);
    } catch (error) {
      console.error("Error saving power interruption:", error);

      // Final cleanup for an unexpected error
      if (uploadedImageUrl) {
        try {
          await deleteStorageImage(
            uploadedImageUrl,
            BUCKET_NAME
          );
        } catch (cleanupError) {
          console.error(
            "Error cleaning up uploaded image:",
            cleanupError
          );
        }
      }

      alert("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (interruption) => {
    const confirmed = window.confirm("Delete this Power Interruption");

    if (!confirmed) return;

    try {
      setDeleting(true);

      const deleteResult = await deletePowerInterruption(interruption.id);

      if (!deleteResult) {
        alert("Failed to delete the power interruption.");
        return;
      }

      if (interruption.image_url) {
        try {
          await deleteStorageImage(
            interruption.image_url,
            BUCKET_NAME
          );
        } catch (error) {
          console.error("Error deleting interruption image:", error);
        }
      }

      await loadInterruptions();

      alert("Power Interruption Deleted Successfully.");
    } catch (error) {
      console.error("Error deleting power interruption:", error);
      alert("Failed to delete the power interruption.");
    } finally {
      setDeleting(false);
    }
  };

  // Split interruptions into schedule / unschedule groups.
  const scheduleInterruptions = powerInterruptions.schedule || [];
  const unscheduleInterruptions = powerInterruptions.unschedule || [];
  const totalInterruptions = scheduleInterruptions.length + unscheduleInterruptions.length;

  const renderFeaturedCard = (interruption) => (
    <div
      key={interruption.id}
      className="group mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:shadow-md"
    >
      <div className="relative flex h-[380px] w-full items-center justify-center overflow-hidden bg-slate-100 p-4 sm:h-[440px]">
        {interruption.image_url ? (
          <img
            src={interruption.image_url}
            alt="Not Found"
            className="h-full w-full rounded-lg bg-white object-contain shadow-sm"
            draggable={false}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <FaImage className="mb-2 text-4xl" />
            <span className="text-sm">No image</span>
          </div>
        )}

        <div className="absolute left-5 top-5 flex items-center gap-2">
          <div className="rounded-full bg-amber-400 px-3 py-1.5 text-[10px] text-slate-950">
            Latest Uploaded
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 text-center">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
            Description
          </p>
          <p className="text-sm font-semibold leading-relaxed text-slate-700 md:text-base">
            {interruption.description || "No description"}
          </p>
        </div>

        <div className="mx-auto flex max-w-sm gap-2">
          <button
            type="button"
            onClick={() => handleEdit(interruption)}
            disabled={deleting}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaEdit />
            Edit
          </button>

          <button
            type="button"
            onClick={() => handleDelete(interruption)}
            disabled={deleting}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaTrash />
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const renderInterruptionCard = (interruption) => (
    <div
      key={interruption.id}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative flex h-[360px] items-center justify-center overflow-hidden bg-slate-100 p-3">
        {interruption.image_url ? (
          <img
            src={interruption.image_url}
            alt="Not Found"
            className="h-full w-full rounded-lg bg-white object-contain shadow-sm"
            draggable={false}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <FaImage className="mb-2 text-4xl" />
            <span className="text-sm">No image</span>
          </div>
        )}

        {(interruption.type) && (
          <div
            className={`absolute left-5 top-5 rounded-full px-3 py-1.5 text-[10px] capitalize text-white backdrop-blur-sm ${
              (interruption.type) === "schedule"
                ? "bg-emerald-600/90"
                : "bg-slate-950/80"
            }`}
          >
            {interruption.type}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
            Description
          </p>
          <p className="line-clamp-3 text-sm font-semibold leading-relaxed text-slate-700">
            {interruption.description || "No Description"}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleEdit(interruption)}
            disabled={deleting}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaEdit />
            Edit
          </button>

          <button
            type="button"
            onClick={() => handleDelete(interruption)}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaTrash />
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const renderSection = (title, icon, list, emptyLabel) => {
    const [latest, ...rest] = list;

    return (
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white/60 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          {icon}
          <h3 className="text-base font-bold text-slate-800 sm:text-lg">
            {title}
          </h3>
          <span className="ml-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-500">
            {list.length}
          </span>
        </div>

        {list.length === 0 ? (
          <div className="flex min-h-[150px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
            <p className="text-sm text-slate-500">{emptyLabel}</p>
          </div>
        ) : (
          <>
            {renderFeaturedCard(latest)}

            {rest.length > 0 && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {rest.map(renderInterruptionCard)}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen w-full pl-5 pr-5 pt-[21px] pb-5"
      style={{ background: "var(--section-bg)" }}
    >
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
              <FaBolt className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Power Interruption
              </h2>
              <p className="mt-0.5 text-sm text-slate-300">
                Manage published power interruption announcements.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <FaPlus className="text-xs" />
            Add Interruption
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500" />
            <p className="text-sm font-semibold text-slate-700">
              Loading power interruptions...
            </p>
          </div>
        ) : totalInterruptions === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
              <FaImage className="text-2xl" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No power interruptions
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Add an interruption image to publish your first power interruption announcement.
            </p>
            <button
              type="button"
              onClick={handleAdd}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              <FaPlus className="text-xs" />
              Add First Interruption
            </button>
          </div>
        ) : (
          <>
            {renderSection(
              "Schedule",
              <FaCalendarCheck className="text-emerald-600" />,
              scheduleInterruptions,
              "No schedule power interruptions yet."
            )}
            {renderSection(
              "Unschedule",
              <FaCalendarTimes className="text-slate-500" />,
              unscheduleInterruptions,
              "No unschedule power interruptions yet."
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingInterruption
                    ? "Update Power Interruption"
                    : "Add Power Interruption"}
                </h3>
                <p className="mt-0.5 text-sm text-slate-500">
                  {editingInterruption
                    ? "Update the interruption image, description, or schedule type."
                    : "Upload an image, provide a description, and set the schedule type."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaTimes />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Interruption Image
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-3 transition hover:border-amber-400 hover:bg-amber-50/30"
                >
                  {previewUrl ? (
                    <div className="relative overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
                      <img
                        src={previewUrl}
                        alt="Not Found"
                        className="mx-auto max-h-[400px] w-full object-contain"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-slate-950/75 px-4 py-3 text-center text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                        Click to replace image
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
                        <FaUpload />
                      </div>
                      <p className="text-sm font-bold text-slate-700">
                        Click to upload interruption image
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        JPG, JPEG, PNG or WEBP • Maximum 10MB
                      </p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {selectedFile && (
                <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-100 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <FaImage className="shrink-0 text-amber-500" />
                    <p className="truncate text-sm font-semibold text-slate-700">
                      {selectedFile.name}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(
                        editingInterruption?.image_url || ""
                      );
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="ml-3 text-slate-400 transition hover:text-red-500"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Schedule Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  >
                    {TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Choose whether this interruption is schedule or unschedule.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Enter power interruption description..."
                  className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />

                <p className="mt-1.5 text-xs text-slate-500">
                  Provide a short description of this power interruption.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={saving}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    {editingInterruption
                      ? "Update Interruption"
                      : "Save Interruption"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerInterruptionManagement;