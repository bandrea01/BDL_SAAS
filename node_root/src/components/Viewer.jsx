import React from "react";
import { useTranslation } from "react-i18next";
import IFCViewer from "../components/canvas/IFCViewer";
import Modal from "./modal";

const Viewer = () => {
  const { i18n } = useTranslation();

  return (
    <div className="sm:w-full h-full relative flex">
      <div className="sm:w-full h-full pt-10 relative z-70">
        <div className="flex">
          <h1 className="text-blue text-6xl ps-[300px] font-bold justify-left">
            {i18n.t("viewer.title")}
          </h1>
          <h1 className="text-blue text-6xl px-10 font-bold justify-left">
            <Modal />
          </h1>
        </div>
        <div className="pt-10 px-[20px] h-[870px]">
          {/* <div className="sm: rounded-[15px] bg-white-100 bg-opacity-20 border-black border-2 min-h-[630px] flex hover:bg-opacity-50 duration-300 ease-in-out" /> */}
          <div className="items-center h-[87vh] w-[97vw] justify-center relative object-contain shadow-2xl shadow-black ">
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
