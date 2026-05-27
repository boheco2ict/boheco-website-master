import { useEffect } from "react";
import { useState } from "react";
import Row from "../../components/ui/Row";
import { supabase } from "../../supabase";
function Dashboard() {
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("tab1");

  const [show, setShow] = useState(false);
  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const tabs = [
    { id: "tab1", label: "Profile" },
    { id: "tab2", label: "Leave Credits" },
    { id: "tab3", label: "Memo" },
    { id: "tab4", label: "Office Order" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("employees")
        .select(
          `
          empnumber,
          firstname,
          middlename,
          lastname,
          department,
          position,
          empstatus,
          address,
          phone1,
          phone2,
          birthdate,
          tin,
          sss,
          pagibig,
          philhealth,
          datehired,
          basicrate,
          riceallowance,
          employee_ledger (
            leave_type,
            leave_balance
          )
        `
        )
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error(error);
      }

      if (data) {
        setEmployee(data);
      }
    };
    setShow(true);
    fetchUser();
  }, []);

  const capitalizeFullName = (name) => {
    if (!name) return "";

    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") return "₱0.00";

    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(Number(value));
  };

  return (
    <>
      <div className="bg-image2 h-screen flex flex-col p-2">
        <div className="pt-24">
          <h1
            className={`text-3xl font-bold transition-all duration-500 ${
              show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            {greeting}, {capitalizeFullName(employee?.firstname)}
          </h1>
        </div>
        <div className="w-full mx-auto">
          {/* Tab Buttons*/}
          <div className="flex border-b border-gray-300">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 text-center transition ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                    : "text-gray-500 hover:text-blue-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Tab Content*/}
          <div className="p-4">
            {activeTab === "tab1" && (
              <div className="h-[60vh] overflow-y-auto bg-white shadow rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Employee Profile</h2>
                <div className="overflow-x-auto">
                  <table>
                    <tbody>
                      <Row
                        label={"Employee Number"}
                        value={employee?.empnumber}
                      />
                      <Row
                        label={"Full Name"}
                        value={`${employee?.firstname} ${employee?.middlename} ${employee?.lastname}`}
                      />
                      <Row label={"Department"} value={employee?.department} />
                      <Row label={"Postion"} value={employee?.position} />
                      <Row label={"Status"} value={employee?.empstatus} />
                      <Row label={"Address"} value={employee?.address} />
                      <Row
                        label={"Mobile Number"}
                        value={`+63${employee?.phone1}`}
                      />
                      <Row
                        label={"Telephone Number"}
                        value={employee?.phone2}
                      />
                      <Row
                        label={"Birthdate"}
                        value={new Date(
                          employee?.birthdate
                        ).toLocaleDateString()}
                      />
                      <Row label={"TIN"} value={employee?.tin} />
                      <Row label={"SSS"} value={employee?.sss} />
                      <Row label={"Pag-IBIG"} value={employee?.pagibig} />
                      <Row label={"PhilHealth"} value={employee?.philhealth} />
                      <Row
                        label={"Date Hired"}
                        value={new Date(
                          employee?.datehired
                        ).toLocaleDateString()}
                      />
                      <Row
                        label={"Basic Rate"}
                        value={formatMoney(employee?.basicrate)}
                        highlight
                      />
                      <Row
                        label={"Rice Allowance"}
                        value={formatMoney(employee?.riceallowance)}
                      />
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === "tab2" && (
              <div>
                {employee?.employee_ledger?.map((ledger, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between mb-2 p-4 bg-white shadow rounded-lg border hover:shadow-md transition"
                  >
                    {/* Left Side*/}
                    <div>
                      <p className="text-sm text-gray-500">Leave Type</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {ledger.leave_type}
                      </p>
                    </div>
                    {/* Right Side */}
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Balance</p>
                      <p className="text-lg font-bold text-blue-600">
                        {ledger.leave_balance}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "tab3" && <div></div>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
