import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { getLedgerAll } from "../../services/getservices";
import ConsumerInformation from "./consumer_information";
import LatestBill from "./latest_bill";
import NoAccountFound from "./no_account_found";
import { FaSpinner } from "react-icons/fa";

const Dashboard = () => {
  const {
    user: authUserInfo,
    consumerInfo,
    loading: authLoading,
  } = useAuth();

  const [forDisplayData, setForDisplayData] = useState([]);
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLedger = async () => {
      if (authLoading || !consumerInfo) return;

      try {
        setLoading(true);

        const response = await getLedgerAll(
          consumerInfo?.consumers_boheco_account
        );

        if (response) {
          setForDisplayData(response);
          setCurrentAccountIndex(0);
        } else {
          setForDisplayData([]);
        }

      } catch (err) {
        console.error("Fetch Ledger Error:", err);
        setForDisplayData([]);

      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  if (loading || authLoading) {
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


  // Currently selected account
  const currentAccount =
    forDisplayData[currentAccountIndex];


  const handlePreviousAccount = () => {
    setCurrentAccountIndex((prev) =>
      prev > 0 ? prev - 1 : prev
    );
  };


  const handleNextAccount = () => {
    setCurrentAccountIndex((prev) =>
      prev < forDisplayData.length - 1
        ? prev + 1
        : prev
    );
  };


  return (
    <div className="m-5 space-y-5">
      {forDisplayData.length === 0 ? (
        <NoAccountFound />
      ) : (
        <>
          {/* Consumer Information */}
          <ConsumerInformation
            account={currentAccount}
            email={authUserInfo?.email}
            currentIndex={currentAccountIndex}
            totalAccounts={forDisplayData.length}
            onPrevious={handlePreviousAccount}
            onNext={handleNextAccount}
          />

          {/* Latest Bill */}
          <LatestBill account={currentAccount} />
        </>
      )}
    </div>
  );
};

export default Dashboard;