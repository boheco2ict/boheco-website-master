import { FaFileInvoiceDollar } from "react-icons/fa";

const NoAccountFound = () => {
    return (
        <div className="m-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center">
                {/* Icon */}
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                    <FaFileInvoiceDollar className="text-3xl" />
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-slate-800">
                    No BOHECO Account Found
                </h2>

                {/* Description */}
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    You don't have any BOHECO accounts linked to your profile yet.
                    Please add an account to view your account information, bills, and
                    ledger.
                </p>
                <p className="mt-3 text-xs font-medium text-slate-400">
                    Go to Settings &gt; Manage Account &gt; Add Account
                </p>
            </div>
        </div>
    );
};

export default NoAccountFound;