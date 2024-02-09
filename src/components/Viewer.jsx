import React from "react";
import { useTranslation } from "react-i18next";
import IFCViewer from "../components/canvas/IFCViewer";

const Viewer = () => {
  const { i18n } = useTranslation();

  return (
    <div className="sm:w-full h-full relative flex">
      <div className="sm:w-full h-full pt-20 relative">
        <h1 className="text-blue text-6xl px-[300px] font-bold justify-left">
          {i18n.t("viewer.title")}
        </h1>
        <div className="py-[50px] px-[70px] h-[900px]">
          {/* <div className="sm: rounded-[15px] bg-white-100 bg-opacity-20 border-black border-2 min-h-[630px] flex hover:bg-opacity-50 duration-300 ease-in-out" /> */}
          <div className="items-center h-[87vh] w-[92vw] justify-center relative object-contain shadow-2xl shadow-black ">
            <IFCViewer
              style={{
                display: "inline-block",
                width: "auto",
                height: "auto",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewer;
