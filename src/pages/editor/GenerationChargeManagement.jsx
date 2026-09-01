import { useEffect, useRef, useState } from "react";
import { supabase } from "../../supabase";
import {
  FaBolt,
  FaEdit,
  FaImage,
  FaPlus,
  FaTrash,
  FaUpload,
  FaTimes,
  FaSave,
  FaGripVertical,
} from "react-icons/fa";

import { getGenerationCharges } from "../../services/getservices";
import { deleteGenerationCharge } from "../../services/deleteservices";
import { createGenerationCharge } from "../../services/postservices";
import { updateGenerationCharge } from "../../services/updateservices";

const BUCKET_NAME = "WEBSITE ASSETS";
const STORAGE_FOLDER = "RATES/GEN";

const GenerationChargeManagement = () => {
  const [generationCharges, setGenerationCharges] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingGenerationCharge, setEditingGenerationCharge] =
    useState(null);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [displayOrder, setDisplayOrder] =
    useState(1);

  const fileInputRef =
    useRef(null);

  // ==========================================
  // LOAD GENERATION CHARGES
  // ==========================================

  useEffect(() => {
    loadGenerationCharges();
  }, []);

  const loadGenerationCharges = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getGenerationCharges();

      setGenerationCharges(data || []);
    } catch (error) {
      console.error(
        "Error loading generation charges:",
        error
      );

      setError(
        "Unable to load generation charge pages."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setEditingGenerationCharge(null);
    setSelectedFile(null);
    setPreviewUrl("");

    setDisplayOrder(
      generationCharges.length + 1
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==========================================
  // ADD
  // ==========================================

  const handleAdd = () => {
    setEditingGenerationCharge(null);
    setSelectedFile(null);
    setPreviewUrl("");

    setDisplayOrder(
      generationCharges.length + 1
    );

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (generationCharge) => {
    setEditingGenerationCharge(
      generationCharge
    );

    setSelectedFile(null);

    setPreviewUrl(
      generationCharge.image_url || ""
    );

    setDisplayOrder(
      generationCharge.display_order
    );

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  // ==========================================
  // SELECT IMAGE
  // ==========================================

  const handleFileChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "Image size must not exceed 10MB."
      );
      return;
    }

    setError("");
    setSelectedFile(file);

    const objectUrl =
      URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
  };

  // ==========================================
  // UPLOAD IMAGE
  // ==========================================

  const uploadImage = async (file) => {
    if (!file) return null;

    const extension =
      file.name.split(".").pop();

    const fileName =
      `Gen${Date.now()}.${extension}`;

    const filePath =
      `${STORAGE_FOLDER}/${fileName}`;

    const { error: uploadError } =
      await supabase.storage
        .from(BUCKET_NAME)
        .upload(
          filePath,
          file,
          {
            cacheControl: "3600",
            upsert: false,
          }
        );

    if (uploadError) {
      throw uploadError;
    }

    const { data } =
      supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(
          filePath
        );

    return data.publicUrl;
  };

  // ==========================================
  // GET STORAGE PATH FROM URL
  // ==========================================

  const getStoragePath = (imageUrl) => {
    if (!imageUrl) return null;

    try {
      const bucketPath =
        `/storage/v1/object/public/${BUCKET_NAME}/`;

      const decodedUrl =
        decodeURIComponent(imageUrl);

      const index =
        decodedUrl.indexOf(
          bucketPath
        );

      if (index === -1) {
        return null;
      }

      return decodedUrl.substring(
        index + bucketPath.length
      );
    } catch (error) {
      console.error(
        "Error getting storage path:",
        error
      );

      return null;
    }
  };

  // ==========================================
  // DELETE STORAGE IMAGE
  // ==========================================

  const deleteStorageImage = async (
    imageUrl
  ) => {
    const path =
      getStoragePath(imageUrl);

    if (!path) return;

    const { error } =
      await supabase.storage
        .from(BUCKET_NAME)
        .remove([path]);

    if (error) {
      console.warn(
        "Unable to delete storage image:",
        error
      );
    }
  };

  // ==========================================
  // SAVE
  // ==========================================

  const handleSave = async () => {
    let uploadedImageUrl = null;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const order =
        Number(displayOrder);

      // ========================================
      // DISPLAY ORDER VALIDATION
      // ========================================

      if (
        !Number.isInteger(order) ||
        order < 1
      ) {
        setError(
          "Display order must be a positive whole number."
        );

        return;
      }

      // ========================================
      // DUPLICATE ORDER VALIDATION
      // ========================================

      const duplicateOrder =
        generationCharges.some(
          (generationCharge) =>
            Number(
              generationCharge.display_order
            ) === order &&
            generationCharge.id !==
              editingGenerationCharge?.id
        );

      if (duplicateOrder) {
        setError(
          `Display order ${order} is already in use. Please choose another order.`
        );

        return;
      }

      // ========================================
      // ADD
      // ========================================

      if (!editingGenerationCharge) {

        if (!selectedFile) {
          setError(
            "Please select a generation charge image."
          );

          return;
        }

        uploadedImageUrl =
          await uploadImage(
            selectedFile
          );

        await createGenerationCharge(
          uploadedImageUrl,
          order
        );

        setSuccess(
          "Generation charge page added successfully."
        );
      }

      // ========================================
      // UPDATE
      // ========================================

      else {

        let imageUrl =
          editingGenerationCharge.image_url;

        if (selectedFile) {

          uploadedImageUrl =
            await uploadImage(
              selectedFile
            );

          imageUrl =
            uploadedImageUrl;
        }

        await updateGenerationCharge(
          editingGenerationCharge.id,
          imageUrl,
          order
        );

        // Delete old image only after
        // successful database update.
        if (
          selectedFile &&
          editingGenerationCharge.image_url
        ) {
          await deleteStorageImage(
            editingGenerationCharge.image_url
          );
        }

        setSuccess(
          "Generation charge page updated successfully."
        );
      }

      await loadGenerationCharges();

      setTimeout(() => {
        setShowModal(false);
        resetForm();
        setSuccess("");
      }, 800);

    } catch (error) {

      console.error(
        "Error saving generation charge:",
        error
      );

      // Delete newly uploaded image if
      // database operation failed.
      if (uploadedImageUrl) {
        await deleteStorageImage(
          uploadedImageUrl
        );
      }

      setError(
        error?.message ||
          "Unable to save the generation charge page."
      );

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (
    generationCharge
  ) => {

    const confirmed =
      window.confirm(
        `Delete Generation Charge Page ${generationCharge.display_order}?\n\nThis action cannot be undone.`
      );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      // Delete database record
      await deleteGenerationCharge(
        generationCharge.id
      );

      // Delete Storage image
      await deleteStorageImage(
        generationCharge.image_url
      );

      setSuccess(
        "Generation charge page deleted successfully."
      );

      await loadGenerationCharges();

      setTimeout(() => {
        setSuccess("");
      }, 2500);

    } catch (error) {

      console.error(
        "Error deleting generation charge:",
        error
      );

      setError(
        error?.message ||
          "Unable to delete the generation charge page."
      );

    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="w-full pl-5 pr-5 pt-[21px] pb-5 min-h-screen" style={{ background: "var(--section-bg)" }}>

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="border-b rounded-2xl border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-5 sm:px-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
              <FaBolt className="text-lg" />
            </div>

            <div>

              <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Generation Charge
              </h2>

              <p className="mt-0.5 text-sm text-slate-300">
                Manage published generation charge pages.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <FaPlus className="text-xs" />
            Add Generation Charge
          </button>

        </div>

      </div>

      {/* ========================================
          ALERTS
      ======================================== */}

      {error && (
        <div className="mx-5 mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 sm:mx-6">
          {error}
        </div>
      )}

      {success && (
        <div className="mx-5 mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 sm:mx-6">
          {success}
        </div>
      )}

      {/* ========================================
          CONTENT
      ======================================== */}

      <div className="p-4 sm:p-6">

        {loading ? (

          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50">

            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500" />

            <p className="text-sm font-semibold text-slate-700">
              Loading generation charges...
            </p>

          </div>

        ) : generationCharges.length === 0 ? (

          /* ======================================
             EMPTY STATE
          ====================================== */

          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
              <FaImage className="text-2xl" />
            </div>

            <h3 className="text-base font-bold text-slate-800">
              No generation charge pages
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Add a generation charge image to
              publish your first page.
            </p>

            <button
              type="button"
              onClick={handleAdd}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              <FaPlus className="text-xs" />
              Add First Page
            </button>

          </div>

        ) : (

          /* ======================================
             GENERATION CHARGE GRID
          ====================================== */

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {generationCharges.map(
              (generationCharge) => (

                <div
                  key={
                    generationCharge.id
                  }
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >

                  {/* IMAGE */}

                  <div className="relative flex h-[360px] items-center justify-center overflow-hidden bg-slate-100 p-3">

                    <img
                      src={
                        generationCharge.image_url
                      }
                      alt={`Generation charge page ${
                        generationCharge.display_order
                      }`}
                      className="h-full w-full rounded-lg bg-white object-contain shadow-sm"
                      draggable={false}
                    />

                    {/* PAGE BADGE */}

                    <div className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">

                      <FaImage className="text-amber-400" />

                      Page{" "}
                      {
                        generationCharge.display_order
                      }

                    </div>

                  </div>

                  {/* CARD BODY */}

                  <div className="p-4">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                        <FaGripVertical className="text-sm" />
                      </div>

                      <p className="text-xs font-bold tracking-wider text-slate-500">
                        Generation Charge #{generationCharge.display_order}
                      </p>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(
                            generationCharge
                          )
                        }
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-slate-950"
                      >
                        <FaEdit />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            generationCharge
                          )
                        }
                        disabled={deleting}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FaTrash />
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* ========================================
          ADD / EDIT MODAL
      ======================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>

                <h3 className="text-lg font-bold text-slate-900">
                  {editingGenerationCharge
                    ? "Update Generation Charge"
                    : "Add Generation Charge"}
                </h3>

                <p className="mt-0.5 text-sm text-slate-500">
                  {editingGenerationCharge
                    ? "Update the image or display order."
                    : "Upload an image for the new generation charge page."}
                </p>

              </div>

              <button
                type="button"
                onClick={
                  handleCloseModal
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <FaTimes />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="max-h-[70vh] overflow-y-auto p-5">

              {/* IMAGE UPLOAD */}

              <div
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="group cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-3 transition hover:border-amber-400 hover:bg-amber-50/30"
              >

                {previewUrl ? (

                  <div className="relative overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">

                    <img
                      src={previewUrl}
                      alt="Generation charge preview"
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
                      Click to upload generation charge
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
                  onChange={
                    handleFileChange
                  }
                  className="hidden"
                />

              </div>

              {/* FILE */}

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

                      setSelectedFile(
                        null
                      );

                      setPreviewUrl(
                        editingGenerationCharge?.image_url ||
                          ""
                      );

                      if (
                        fileInputRef.current
                      ) {
                        fileInputRef.current.value =
                          "";
                      }

                    }}
                    className="ml-3 text-slate-400 hover:text-red-500"
                  >
                    <FaTimes />
                  </button>

                </div>

              )}

              {/* DISPLAY ORDER */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Display Order
                </label>

                <input
                  type="number"
                  min="1"
                  value={displayOrder}
                  onChange={(event) =>
                    setDisplayOrder(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />

                <p className="mt-1.5 text-xs text-slate-500">
                  Determines the order in which
                  generation charge pages appear
                  to users.
                </p>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={
                  handleCloseModal
                }
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

                    {editingGenerationCharge
                      ? "Update Generation Charge"
                      : "Save Generation Charge"}
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

export default GenerationChargeManagement;