import React from "react";
import { BsQuestionCircle } from "react-icons/bs";
import { useTranslation } from "react-i18next";

const Modal = () => {
  const { i18n } = useTranslation();
  const [showModal, setShowModal] = React.useState(false);
  return (
    <>
      <BsQuestionCircle
        className="text-blue hover:cursor-pointer"
        onClick={() => setShowModal(true)}
      />
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-blue outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl text-viewer-green">
                    {i18n.t("modal.title")}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-white opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:text-viewer-green"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-white opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-white text-lg font-normal leading-relaxed">
                    {i18n.t("modal.body.toolbarInstructions")}
                    <br />
                    {i18n.t("modal.body.leftMouse")}
                    <br />
                    {i18n.t("modal.body.rightMouse")}
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className=" bg-viewer-green font-bold rounded-[15px] uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-white"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    {i18n.t("modal.close")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
