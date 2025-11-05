import React from "react";
const NoticeComponent = ({ title, path }) => {
  return (
    <div>
      <section className="pt-8">
        <div className="flex items-center justify-center text-xl py-2 md:text-2xl lg:text-4xl font-[Gloock] font-extrabold lg:py-2 uppercase">
          {title}
        </div>
        <div className="w-full select-one py-2 flex justify-center items-center relative">
          <div>
            <img
              className="md:h-[960px] h-[720]"
              draggable={false}
              src={path}
              alt={title}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default NoticeComponent;
