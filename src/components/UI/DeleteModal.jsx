import React, { useState } from "react";
import { Button, Modal } from "antd";
import { AlertTriangle } from "lucide-react";
import TrashOpen from "../../assets/images/common-icons/OpenTrash.svg";

const DeleteModal = ({ open, onCancel, deleteValue, pageName }) => {
  const modalWidth = 450;
  const modalWidthTwo = 550;
  const [isSucessOpen, setIsSuccessOpen] = useState(false);
  const onConfirm = () => {
    setIsSuccessOpen(true);
    onCancel();
  };
  return (
    <Modal
      open={open}
      centered
      onCancel={onCancel}
      footer={null}
      closable={isSucessOpen ? false : true}
      className="rounded-xl"
      width={isSucessOpen ? modalWidth : modalWidthTwo}
      title={
        isSucessOpen ? (
          ""
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-[#111928] capitalize">
              Delete {pageName}
            </h2>
            <p className="text-sm text-[#888C93] mt-1">
              The {pageName} will be deleted
            </p>
          </div>
        )
      }
    >
      {isSucessOpen ? (
        <div className="flex flex-col items-center text-center space-y-4 py-8">
          <img src={TrashOpen} />

          <h2 className="text-xl font-semibold text-[#842F2F]">
            Deleted Successfully
          </h2>

          <p className="text-sm text-[#70757E] font-medium">
            <span className=" capitalize">{pageName}</span>{" "}
            <strong>{deleteValue}</strong> has been <br />
            deleted successfully
          </p>

          <div className="h-1 w-24 bg-[#842F2F] rounded-full mt-2" />
        </div>
      ) : (
        <>
          <hr className="border border-gray-300 my-4" />
          <div className="bg-[#FFE9D9] border-l-4 border-[#F67545] rounded p-default mt-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-[#F67545] w-5 h-5 mt-0.5" />
              <div>
                <p className="text-[#843333] font-medium">Warning</p>
                <p className="text-[#D66552] text-sm mt-1">
                  Are you sure you want to delete
                  <strong> {deleteValue} </strong>?<br />
                  You can’t undo this action.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onConfirm} className="delete-confirm-button">
              Yes, Delete
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default DeleteModal;
