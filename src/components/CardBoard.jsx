import { useEffect } from "react";
import { useState } from "react";
import { supabase } from "../supabase";
import BCards from "./BCards";

const CardBoard = () => {
  const [bod, setBod] = useState([]);

  useEffect(() => {
    fetchBod();
  }, []);

  async function fetchBod() {
    const { data, error } = await supabase
      .from("bod")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
    }

    setBod(data);
  }

  const row1 = bod.slice(0, 1);
  const row2 = bod.slice(1, 5);
  const row3 = bod.slice(5, 9);

  return (
    <section>
      {/* MANAGEMENT */}
      <div className="flex justify-center text-center text-4xl font-[Gloock] font-extrabold uppercase">
        Board Of Directors
      </div>
      <section className="flex justify-center items-center">
        {row1.map((item) => (
          <BCards
            key={item.id}
            path={item.url}
            title={item.title}
            name={item.name}
            address={item.address}
            position={item.position}
          />
        ))}
      </section>
      <section className="flex justify-center 2xl:flex-row flex-col gap-6 items-center">
        {row2.map((item) => (
          <BCards
            key={item.id}
            path={item.url}
            title={item.title}
            name={item.name}
            address={item.address}
            position={item.position}
          />
        ))}
      </section>
      <section className="flex justify-center 2xl:flex-row flex-col gap-6 items-center">
        {row3.map((item) => (
          <BCards
            key={item.id}
            path={item.url}
            title={item.title}
            name={item.name}
            address={item.address}
            position={item.position}
          />
        ))}
      </section>
    </section>
  );
};

export default CardBoard;
