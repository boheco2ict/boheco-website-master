import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ListComponent from "../components/ListComponent";
import { supabase } from "../supabase";

function Policy() {
  const [policyData, setPolicyData] = useState([]);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    const { data, error } = await supabase
      .from("policy")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const sortedData = data.sort((a, b) => {
      // Always place Compilation of Old Policies at bottom
      if (a.group === "Compilation of Old Policies") return 1;
      if (b.group === "Compilation of Old Policies") return -1;

      // Sort years descending
      return Number(b.group) - Number(a.group);
    });

    setPolicyData(sortedData);
  };

  return (
    <>
      <div className="bg-image2 flex flex-col items-center justify-center">
        <section className="container px-5 py-24 mx-auto">
          <div className="text-center mb-12">
            <div className="text-4xl font-extrabold py-2">Coop Policies</div>
            <div className="text-4xl font-extrabold py-2">
              <div className="flex flex-col justify-center items-center">
                <ul className="space-y-4">
                  {policyData.map((item, index) => {
                    const isNewGroup =
                      index === 0 || policyData[index - 1].group !== item.group;
                    return (
                      <React.Fragment key={index}>
                        {isNewGroup && <li>{item.group}</li>}
                        <ListComponent
                          key={index}
                          title={item.title}
                          url={item.url}
                        />
                      </React.Fragment>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Policy;
