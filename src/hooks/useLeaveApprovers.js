import { useEffect, useState } from "react";
import { getLeaveApproverByDepartment } from "../services/getservices";

export function useLeaveApprovers(department) {
  const [approverId, setApproverId] = useState([]);
  const [approverName, setApproverName] = useState([]);
  const [approverEmail, setApproverEmail] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeaveApprover = async () => {
      try {
        setLoading(true);
        const leaveApprover = await getLeaveApproverByDepartment(department);
        const { approverEmails, approverIDs, approverNames } = leaveApprover;
        setApproverId(approverIDs);
        setApproverName(approverNames);
        setApproverEmail(approverEmails);
      } catch (error) {
        setApproverId([]);
        setApproverName([]);
        setApproverEmail([]);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveApprover();
  }, [department]);

  return { approverId, approverName, approverEmail, loading };
}
