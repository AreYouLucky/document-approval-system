import React from "react";
import Modal from "@/Components/Forms/Modal";
import PrimaryButton from "@/Components/Clickables/SecondaryButton";
import { memo } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "@inertiajs/react";

function SuccessDialogs({ show, onClose, message = "", link = "" }) {
    return (
        <div>
            <Modal show={show} onClose={onClose} maxWidth="sm" >
                <form className="px-5 bg-white dark:bg-gray-800  text-gray-900 dark:text-gray-50 rounded-xl">
                    <div>
                        <div className="pt-6 px-6 flex w-full justify-center">
                            <FaCheckCircle size={60} color={'green'} />
                        </div>
                        <div className="px-6 my-3 w-auto pb-6">
                            <div className="mt-4 text-center">
                                <span className="roboto-regular text-lg">{message}</span>

                            </div>
                            <div className="mt-4 flex justify-center text-gray-800 dark:text-gray-50">
                                {link === '' ?
                                    <PrimaryButton onClick={onClose} className="rounded-lg bg-blue-400">
                                        Close
                                    </PrimaryButton> :
                                    <Link href={link} className="rounded-lg px-5 py-2 border text-sm bg-gray-50 border-slate-400">
                                        Close
                                    </Link>
                                }
                            </div>
                        </div>

                    </div>

                </form>
            </Modal>
        </div>
    );
}

export default memo(SuccessDialogs);
