import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { extractBillDetails } from "../utils";

const BillInquiry = () => {
  const [consumerName, setConsumerName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [billMonth, setBillMonth] = useState("");
  const [billingDetails, setBillingDetails] = useState({
    error: null,
    data: null,
  });
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function initSession() {
      try {
        const response = await axios.get(
          "https://bill-inquiry-api.onrender.com/api/v1/session-init",
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        return response;
      } catch (error) {
        setStatus(false);
        console.error("Error initializing session: ", error);
      }
    }
    // Initialize session and set an interval to refresh
    initSession();
    const interval = setInterval(initSession, 90 * 1000); // Refresh session every 90s
    return () => clearInterval(interval);
  }, []);

  const formatValue = (value) => {
    let digits = value.replace(/\D/g, "").slice(0, 6);

    if (digits.length >= 2) {
      const month = digits.slice(0, 2);
      if (+month < 1 || +month > 12) return digits.slice(0, 1);
    }

    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      ConsumerName: consumerName,
      AccountNumber: accountNumber,
      ServicePeriodEnd:
        billMonth.split("-")[0] + "/01/" + billMonth.split("-")[1],
    };
    try {
      const response = await axios.post(
        "https://bill-inquiry-api.onrender.com/api/v1/bill",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const { error, data: extractedData } = extractBillDetails(
        response.data.msg
      );
      setBillingDetails({ error, data: extractedData });
    } catch (error) {
      setBillingDetails({
        error: new Error("Something went wrong. Please try again."),
      });
      console.error(error);
    } finally {
      setLoading(false);
      setAccountNumber("");
      setConsumerName("");
      setBillMonth("");
    }
    setOpen(true);
  };
  return (
    <>
      <div className="bg-image2 flex flex-col items-center justify-center h-screen">
        <form action="POST" onSubmit={handleInquiry}>
          <div className="rounded-lg shadow-md p-12 bg-white bg-opacity-40 mb-6">
            <div className="text-2xl font-bold">BOHECO II - Bill Inquiry</div>
            <small>
              {status ? (
                <div className="mb-4 font-bold text-green-600">Online</div>
              ) : (
                <div className="mb-4 font-bold text-red-600">Offline</div>
              )}
            </small>
            <div className="mb-4 ">
              <div className="mb-4 ">
                <label
                  htmlFor="consumerName"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Consumer Name:
                </label>
                <input
                  type="text"
                  id="consumerName"
                  name="consumerName"
                  required
                  maxLength="20"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={(e) => setConsumerName(e.target.value)}
                  value={consumerName}
                  disabled={!status}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="accountNumber"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Account Number (10 Digit):
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="accountNumber"
                  name="accountNumber"
                  required
                  maxLength="10"
                  placeholder="XXXXXXXXXX"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={(e) =>
                    setAccountNumber(e.target.value.replace(/\D/g, ""))
                  }
                  value={accountNumber}
                  disabled={!status}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="billMonth"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Bill Month (MM-YYYY):
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  id="billMonth"
                  name="billMonth"
                  required
                  maxLength="7"
                  placeholder="01-2026"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={(e) => setBillMonth(formatValue(e.target.value))}
                  value={billMonth}
                  disabled={!status}
                />
              </div>
            </div>
            <div className="flex justify-center">
              {loading ? (
                <div>
                  {status && (
                    <button
                      type="submit"
                      disabled={true}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2"
                    >
                      Please wait...
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  {status && (
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2"
                    >
                      Submit
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Modal for Response */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
            >
              {billingDetails.error ? (
                <div>{billingDetails.error.message}</div>
              ) : (
                <div>
                  <div className="flex flex-col gap-3 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ₱{billingDetails.data.amount}
                    </div>
                    <div className="uppercase font-semibold text-red-500">
                      Amount due on: {billingDetails.data.dueDate}
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <span className="font-semibold text-zinc-400">
                          kWh USED:{" "}
                        </span>
                        <span className="font-bold">
                          {billingDetails.data.kWhUsed}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-zinc-400">
                          STATUS:{" "}
                        </span>
                        <span className="font-bold">
                          {billingDetails.data.billStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BillInquiry;
