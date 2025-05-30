import React from "react";
import Modal from "@/Components/Forms/Modal";
import PrimaryButton from "@/Components/Clickables/SecondaryButton";
import { memo } from "react";
import { Avatar } from "flowbite-react";
import { MdError } from "react-icons/md";

function ErrorDialogs({ show, onClose, message = "" }) {
    return (
        <div>
            <Modal show={show} onClose={onClose} maxWidth="sm" >
                <form className="px-5 bg-white rounded-xl">
                    <div>
                        <div className="pt-6 px-6 flex w-full justify-center">
                            <MdError size={60} color={'red'}/>
                        </div>
                        <div className="px-6 my-3 w-auto pb-6">
                            <div className="mt-4 text-center">
                                <span className="roboto-regular text-lg">{message}</span>

                            </div>
                            <div className="mt-4 flex justify-center">
                                <PrimaryButton onClick={onClose} className="rounded-lg bg-red-400">
                                    Close
                                </PrimaryButton>
                            </div>
                        </div>

                    </div>

                </form>
            </Modal>
        </div>
    );
}

export default memo(ErrorDialogs);
