import React from "react";
import Modal from "@/Components/Forms/Modal";
import PrimaryButton from '@/Components/Forms/PrimaryButton';
import { memo, useState } from "react";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import SecondaryButton from "@/Components/Clickables/SecondaryButton";


function RoleForm({ show, onClose, data = [] }) {
    const [role,setRole] = useState('');
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);


    const user_type = [
        { name: "Process Owner", value: 2 },
        { name: "Document Custodian", value: 3 },
        { name: "Division Chief", value: 4 },
        { name: "QMR", value: 5 },
    ];

    const handleChange = (e) => {
        setRole(e.target.value);
    };

    const changeRole = (e) => {
        e.preventDefault();
        setProcessing(true);
        if(role===''){
            setErrors((prevErrors) => ({
                ...prevErrors,
                role: "Similar to current role",
              }))
        }else{
            let formData = new FormData();
            formData.append('id', data.id);
            formData.append('role', role)
            axios.post('/change-role',formData).then(
                res =>{
                    onClose();
                }
            )
        }





    };
    return (
        <div>
            <Modal show={show} onClose={onClose} maxWidth="sm" >
                <form className="px-5 py-5 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-50 rounded-xl">
                    <div className="px-6 py-3">
                        <div className="flex items-center whitespace-nowrap">
                            <img className="w-24 h-24 rounded-full" src="/storage/images/user.png" />
                            <div className="ps-3">
                                <div className="text-sm font-semibold">{data.full_name}</div>
                                <div className=" text-sm text-gray-500">{data.role}</div>
                            </div>
                        </div>
                        <div className="pt-3">
                            <InputLabel htmlFor="file_type" value="Change Role" />
                            <SelectInput
                                id="file_type"
                                items={user_type}
                                itemValue="name"
                                itemName="name"
                                defaultValue={data.role}
                                name="file_type"
                                onChange={handleChange}
                            />
                            <InputError message={errors.role} className="mt-2" />
                        </div>
                        <div className="px-6 my-3 w-auto">
                            <div className="mt-5 flex justify-center">
                                <SecondaryButton onClick={onClose} className="rounded-lg  ">
                                    Close
                                </SecondaryButton>

                                <PrimaryButton className="ml-2 bg-sky-600" >
                                    <span className=' text-white nunito-bold mx-2' onClick={changeRole}>SAVE</span>
                                </PrimaryButton>
                            </div>
                        </div>

                    </div>

                </form>
            </Modal>
        </div>
    );
}

export default memo(RoleForm);
