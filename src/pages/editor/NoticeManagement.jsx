import { useEffect, useRef, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaImage,
  FaFileAlt,
  FaSpinner,
  FaExternalLinkAlt,
  FaTimes,
} from "react-icons/fa";
import { formatDateComplete } from "../../utils/utils";
import { useAuth } from "../../context/AuthContext";
import {
  uploadStorageImage,
  deleteStorageImage,
} from "../../services/storageservices";
import { getNotice } from "../../services/getservices";
import { createNotice } from "../../services/postservices";
import { deleteNotice } from "../../services/deleteservices";
import { updateNotice } from "../../services/updateservices";

const BUCKET_NAME = "WEBSITE ASSETS";
const STORAGE_FOLDER = "NOTICE";

const NoticeManagement = () => {
  const fileInputRef = useRef(null);
  const { employeeInfo, loading: authLoading } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(notices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotices = notices.slice(startIndex, endIndex);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await getNotice();
      setNotices(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setFileUrl("");
    setImageFile(null);
    setImagePreview("");
    setEditingNotice(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (notice) => {
    setEditingNotice(notice);
    setTitle(notice.title || "");
    setFileUrl(notice.file_url || "");
    setImageFile(null);
    setImagePreview(notice.image_url);
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    resetForm();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must not exceed 10MB.");
      return;
    }
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanFileUrl = fileUrl.trim();

    if (!cleanTitle) {
      alert("Notice title is required.");
      return;
    }

    if (!cleanFileUrl) {
      alert("File URL is required.");
      return;
    }

    let uploadedImageUrl = null;

    try {
      setSaving(true);

      if (!editingNotice) {
        // ADD
        if (imageFile) {
          try {
            uploadedImageUrl = await uploadStorageImage({
              file: imageFile,
              bucket: BUCKET_NAME,
              folder: STORAGE_FOLDER,
              prefix: "NOTICE",
            });
          } catch (error) {
            console.error("Error uploading notice image:", error);
            alert("Failed to upload the image. Please try again.");
            return;
          }
        }

        const createNoticeRes = await createNotice(
          cleanTitle,
          cleanFileUrl,
          uploadedImageUrl,
          employeeInfo?.id
        );

        if (!createNoticeRes) {
          if (uploadedImageUrl) {
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
          }

          alert("Failed to add the notice. Please try again.");
          return;
        }

        uploadedImageUrl = null;

        alert("Notice Added Successfully.");
      } else {
        // UPDATE
        let imageUrl = editingNotice.image_url || null;

        if (imageFile) {
          try {
            uploadedImageUrl = await uploadStorageImage({
              file: imageFile,
              bucket: BUCKET_NAME,
              folder: STORAGE_FOLDER,
              prefix: "NOTICE",
            });
          } catch (error) {
            console.error("Error uploading new notice image:", error);
            return;
          }

          if (!uploadedImageUrl) {
            return;
          }

          imageUrl = uploadedImageUrl;
        }

        const updateRes = await updateNotice(
          cleanTitle,
          cleanFileUrl,
          imageUrl,
          editingNotice.id
        );

        if (!updateRes) {
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

          alert("Failed to update the notice. Please try again.");
          return;
        }

        // Delete old image only after successful DB update
        if (imageFile && editingNotice.image_url) {
          try {
            await deleteStorageImage(
              editingNotice.image_url,
              BUCKET_NAME
            );
          } catch (error) {
            console.error(
              "Error deleting old notice image:",
              error
            );
          }
        }

        uploadedImageUrl = null;

        alert("Notice Updated Successfully.");
      }

      await fetchNotices();
      setCurrentPage(1);

      setTimeout(() => {
        setShowModal(false);
        resetForm();
      }, 800);
    } catch (err) {
      console.error("Notice save error:", err);

      // Final cleanup for unexpected errors
      if (uploadedImageUrl) {
        try {
          await deleteStorageImage(
            uploadedImageUrl,
            BUCKET_NAME
          );
        } catch (cleanupError) {
          console.error(
            "Error cleaning up uploaded notice image:",
            cleanupError
          );
        }
      }

    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (notice) => {
    const confirmed = window.confirm(`Are you sure you want to delete notice title?\n\n${notice.title}`);
    if (!confirmed) return;

    try {
      setSaving(true);

      await deleteNotice(notice.id);
  
      setNotices((prev) => {
        const updated = prev.filter((item) => item.id !== notice.id);
        const newTotalPages = Math.ceil(updated.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
        return updated;
      });

      await deleteStorageImage(notice.image_url, BUCKET_NAME);
      alert("Notice Deleted Successfully.");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const removeSelectedImage = () => {
    setImageFile(null);

    if (editingNotice?.image_url) {
      setImagePreview(editingNotice.image_url);
    } else {
      setImagePreview("");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <FaSpinner className="animate-spin text-3xl text-orange-500" />
          <p className="text-sm font-medium text-slate-500">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <FaSpinner className="animate-spin text-3xl text-orange-500" />
          <p className="text-sm font-medium text-slate-500">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-5">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl bg-slate-900 p-6 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500">
              <FaFileAlt className="text-lg text-white" />
            </div>

            <h1 className="text-xl font-bold text-white">
              Notice Management
            </h1>
          </div>

          <p className="text-sm text-slate-400">
            Manage public notices, documents, and preview images.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <FaPlus />
          Add Notice
        </button>
      </div>

      {/* Notice List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Published Notices
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {notices.length} notice{notices.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {notices.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <FaFileAlt className="text-2xl text-slate-400" />
            </div>

            <h3 className="font-semibold text-slate-700">
              No notices found
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              Add your first public notice to display it here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {currentNotices.map((notice) => (
              <div
                key={notice.id}
                className="flex flex-col gap-5 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center"
              >
                {/* Image */}
                <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:h-24 sm:w-32">
                  <img
                    src={notice.image_url}
                    alt={notice.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 font-semibold text-slate-900">
                    {notice.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <p className="text-[10px] text-slate-500">
                      Posted by {notice.posted_by} <br></br>
                      Posted at {formatDateComplete(notice.created_at)}
                    </p>
                  </div>  

                  {notice.file_url && (
                    <a
                      href={notice.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700"
                    >
                      <FaFileAlt />
                      View Document
                      <FaExternalLinkAlt className="text-xs" />
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(notice)}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <FaEdit />
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(notice)}
                    disabled={saving}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaTrash />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {notices.length > itemsPerPage && (
          <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(endIndex, notices.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {notices.length}
              </span>{" "}
              notices
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                      currentPage === page
                        ? "bg-orange-500 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingNotice ? "Edit Notice" : "Add Notice"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingNotice
                    ? "Update the notice information and image."
                    : "Create a new public notice."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-5 p-6">

                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Notice Title
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter notice title"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    disabled={saving}
                  />
                </div>

                {/* File URL */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Document / File URL
                  </label>

                  <input
                    type="url"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    disabled={saving}
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    Paste the Google Drive or document link for this notice.
                  </p>
                </div>

                {/* Image */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Notice Image
                  </label>

                  <div className="rounded-2xl border-2 border-dashed border-orange-400 bg-orange-50/20 p-3">
                    {imagePreview ? (
                      <label className="group relative block h-[420px] cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <img
                          src={imagePreview}
                          alt="Notice preview"
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />

                        {/* Bottom Overlay */}
                        <div className="absolute inset-x-0 bottom-0 flex h-12 items-center justify-center bg-slate-900/80 text-sm font-semibold text-white transition group-hover:bg-slate-900/90">
                          <span>
                            {imageFile ? "Click to replace image" : "Click to replace image"}
                          </span>
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={saving}
                        />
                      </label>
                    ) : (
                      <label className="flex h-[340px] cursor-pointer flex-col items-center justify-center rounded-xl bg-white text-center transition hover:bg-orange-50">
                        <div className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                          <FaImage className="text-2xl text-slate-400" />
                        </div>

                        <span className="text-base font-semibold text-slate-700">
                          Click to upload notice
                        </span>

                        <span className="mt-2 text-sm text-slate-400">
                          JPG, JPEG, PNG or WEBP • Maximum 10MB
                        </span>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={saving}
                        />
                      </label>
                    )}
                  </div>

                  {/* Selected File */}
                  {imageFile && (
                    <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                        <FaImage className="text-sm text-orange-500" />
                      </div>

                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-600">
                        {imageFile.name}
                      </span>

                      <button
                        type="button"
                        onClick={removeSelectedImage}
                        disabled={saving}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:opacity-50"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && <FaSpinner className="animate-spin" />}

                  {editingNotice ? "Update Notice" : "Add Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeManagement;