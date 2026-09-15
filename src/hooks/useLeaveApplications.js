import { useEffect, useState } from "react";
import {
  getMyHistoryApplicationByID,
  getMyPendingApplicationByID,
  getAllPendingApplications,
} from "../services/getservices";
import {
  cancelApplication,
  rejectApplication,
  approveApplication,
} from "../services/updateservices";

export function useLeaveApplications(myID) {
  const [pendingApplications, setPendingApplications] = useState([]);
  const [assignedApplications, setAssignedApplications] = useState([]);
  const [historyApplications, setHistoryApplications] = useState([]);

  const [processingApproval, setIsProcessingApproval] = useState(null);
  const [processingReject, setIsProcessingReject] = useState(null);
  const [processingCancel, setIsProcessingCancel] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!myID) {
          throw new Error("Employee ID is Required.");
        }

        try {
          const responseHistory = await getMyHistoryApplicationByID(myID);
          setHistoryApplications(responseHistory || []);
        } catch (error) {
          console.error(error);
          setHistoryApplications([]);
        }

        try {
          const responsePending = await getMyPendingApplicationByID(myID);
          setPendingApplications(responsePending || []);
        } catch (error) {
          console.error(error);
          setPendingApplications([]);
        }

        try {
          const responseAssign = await getAllPendingApplications();
          const myAssignApplications = responseAssign.filter((application) =>
            application.approver_id_status?.some(
              (approver) =>
                Number(approver.id) === Number(myID) &&
                approver.status === "pending"
            )
          );
          setAssignedApplications(myAssignApplications || []);
        } catch (error) {
          console.error(error);
          setAssignedApplications([]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, [myID]);

  const handleApprove = async (application) => {
    if (!application) {
      alert("No Application Selected.");
    }
    const confirmed = window.confirm(
      "Are you sure you want to approve this leave application?"
    );
    if (!confirmed) return;

    try {
      setIsProcessingApproval(application.id);
      const response = await approveApplication(application, myID);
      if (response) {
        alert("Approved Successfully.");
        setAssignedApplications((prev) =>
          prev.filter((p) => p.id !== application.id)
        );
        setPendingApplications((prev) =>
          prev.filter((p) => p.id !== application.id)
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessingApproval(null);
    }
  };

  const handleCancelApplication = async (application_id) => {
    if (!application_id) {
      alert("No Application ID Provided.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this leave application?"
    );
    if (!confirmed) return;

    try {
      setIsProcessingCancel(application_id);
      const response = await cancelApplication(application_id);

      if (response) {
        alert("Application Cancelled Successfully.");
        setPendingApplications((prev) =>
          prev.filter((p) => p.id !== application_id)
        );
        setAssignedApplications((prev) =>
          prev.filter((p) => p.id !== application_id)
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessingCancel(null);
    }
  };

  // Takes the application explicitly (instead of reading it off shared
  // state) so the reject-confirmation UI can live inside whichever
  // section renders the "Reject" button.
  const handleReject = async (selectedApplication, reason) => {
    if (!reason) {
      alert("No Reason Provided.");
      return false;
    }

    if (!selectedApplication) {
      alert("No Application Provided.");
      return false;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reject this leave application?"
    );
    if (!confirmed) return false;

    try {
      setIsProcessingReject(selectedApplication.id);
      const response = await rejectApplication(
        selectedApplication,
        reason,
        myID
      );
      if (response) {
        setAssignedApplications((prev) =>
          prev.filter((p) => p.id !== response.id)
        );
        if (response.employee_id === myID) {
          setPendingApplications((prev) =>
            prev.filter((p) => p.id !== response.id)
          );
        }
        alert("Application Rejected.");
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsProcessingReject(null);
    }
  };

  return {
    pendingApplications,
    assignedApplications,
    historyApplications,
    processingApproval,
    processingReject,
    processingCancel,
    handleApprove,
    handleCancelApplication,
    handleReject,
  };
}
