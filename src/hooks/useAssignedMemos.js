import { useEffect, useState } from "react";
import { getMyAssignMemo } from "../services/getservices";
import { markAsReadMemo } from "../services/updateservices";

const ITEMS_PER_PAGE = 5;

export function useAssignedMemos(employee) {
  const [myAssignMemo, setMyAssignMemo] = useState([]);
  const [isMemoLoading, setIsMemoLoading] = useState(false);
  const [markingMemoId, setMarkingMemoId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(myAssignMemo.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMemos = myAssignMemo.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchMyAssignMemo = async () => {
      try {
        setIsMemoLoading(true);
        const response = await getMyAssignMemo(employee.employee.id);
        setMyAssignMemo(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsMemoLoading(false);
      }
    };
    if (employee) {
      fetchMyAssignMemo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee?.id, employee?.role]);

  const handleMarkAsRead = async (memoData, a) => {
    if (!memoData) {
      alert("No memo data available.");
      return;
    }

    if (memoData.is_read) return;

    try {
      setMarkingMemoId(memoData.id);
      const response = await markAsReadMemo(memoData.id);
      if (response) {
        // Update the memo in the UI immediately
        setMyAssignMemo((prevMemos) =>
          prevMemos.map((memo) =>
            memo.id === memoData.id
              ? {
                  ...memo,
                  is_read: true,
                  read_at: new Date().toISOString(),
                }
              : memo
          )
        );
        setCurrentPage(1);
        if (a === 0) {
          alert("Marked as Read.");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setMarkingMemoId(null);
    }
  };

  const handleOpenMemo = async (memoData) => {
    if (!memoData) {
      alert("No memo data available.");
      return;
    }
    if (memoData.url) {
      if (memoData.is_read === false) {
        handleMarkAsRead(memoData, 1);
      }
      window.open(memoData.url, "_blank", "noopener,noreferrer");
    }
  };

  return {
    myAssignMemo,
    isMemoLoading,
    markingMemoId,
    currentPage,
    totalPages,
    currentMemos,
    handleMarkAsRead,
    handleOpenMemo,
    // Ported exactly as the original inline handlers — no bounds clamping.
    goToPrevious: () => setCurrentPage((page) => page - 1),
    goToNext: () => setCurrentPage((page) => page + 1),
  };
}
