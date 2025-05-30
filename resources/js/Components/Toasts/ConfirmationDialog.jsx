import React, { memo } from "react";
import Modal from "@/Components/Forms/Modal";
import PrimaryButton from "@/Components/Forms/PrimaryButton";
import { FaQuestionCircle } from "react-icons/fa";

function ConfirmationDialog({ show, processing=false, onClose, onConfirm, message = "", subtitle = "" }) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 rounded-xl">
                <div className="flex flex-col items-center">
                    <FaQuestionCircle size={50} className="text-green-400" />
                    <p className="mt-4 text-lg text-center roboto-semibold">{message}</p>
                    <span className="text-sm text-center text-gray-500">{subtitle}</span>
                </div>
                <div className="mt-6 flex justify-center gap-4">
                    <PrimaryButton onClick={onClose} className="rounded-lg bg-cyan-600 text-base text-white" disabled={processing}>
                        {processing ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> :
                            <div>
                                No
                            </div>}
                    </PrimaryButton>
                    <PrimaryButton disabled={processing} onClick={onConfirm} className="rounded-lg bg-blue-600 text-base text-white" >
                        {processing ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> :
                            <div>
                                Yes
                            </div>}
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}

export default memo(ConfirmationDialog);
