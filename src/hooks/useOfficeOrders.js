import { useEffect, useState } from "react";
import { getMyAssignOfficeOrder } from "../services/getservices";
import { markAsReadOfficeOrder } from "../services/updateservices";

function useOfficeOrders(employee, setOfficeOrderMessage) {
  const [myAssignOfficeOrder, setMyAssignOfficeOrder] = useState([]);
  const [isOfficeOrderLoading, setIsOfficeOrderLoading] = useState(false);
  const [markingOfficeOrderId, setMarkingOfficeOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(myAssignOfficeOrder.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMemos = myAssignOfficeOrder.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsOfficeOrderLoading(true);
        const response = await getMyAssignOfficeOrder(employee.employee.id);
        setMyAssignOfficeOrder(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsOfficeOrderLoading(false);
      }
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee?.id, employee?.role]);

  // =========================================================
  // OPEN OFFICE ORDER
  // =========================================================
  const handleOpenMemo = async (officeOrderData) => {
    if (!officeOrderData) {
      alert("No office order data available.");
      return;
    }
    if (officeOrderData.url) {
      if (officeOrderData.is_read === false) {
        handleMarkAsRead(officeOrderData, 1);
      }
      window.open(officeOrderData.url, "_blank", "noopener,noreferrer");
    }
  };

  // =========================================================
  // MARK OFFICE ORDER AS READ
  // =========================================================
  const handleMarkAsRead = async (officeOrderData, a) => {
    if (!officeOrderData) {
      alert("No office order data available.");
      return;
    }

    if (officeOrderData.is_read) return;

    try {
      setMarkingOfficeOrderId(officeOrderData.id);
      const response = await markAsReadOfficeOrder(officeOrderData.id);
      if (response) {
        // Update the office order in the UI immediately
        setMyAssignOfficeOrder((prevMemos) =>
          prevMemos.map((officeorder) =>
            officeorder.id === officeOrderData.id
              ? {
                  ...officeorder,
                  is_read: true,
                  read_at: new Date().toISOString(),
                }
              : officeorder
          )
        );
        setCurrentPage(1);
        if (a === 0) {
          alert("Marked as Read.");
        }
      }
    } catch (error) {
      console.error("Error marking as read:", error);
      setOfficeOrderMessage(error?.message || "Failed to mark as read.");
    } finally {
      setMarkingOfficeOrderId(null);
    }
  };

  return {
    myAssignOfficeOrder,
    isOfficeOrderLoading,
    markingOfficeOrderId,
    currentPage,
    totalPages,
    currentMemos,
    handleOpenMemo,
    handleMarkAsRead,
    goToPreviousPage: () => setCurrentPage((page) => page - 1),
    goToNextPage: () => setCurrentPage((page) => page + 1),
  };
}

export default useOfficeOrders;
