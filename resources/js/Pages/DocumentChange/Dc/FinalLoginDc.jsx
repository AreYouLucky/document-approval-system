import Checkbox from '@/Components/Forms/Checkbox';
import InputError from '@/Components/Forms/InputError';
import InputLabel from '@/Components/Forms/InputLabel';
import PrimaryButton from '@/Components/Forms/PrimaryButton';
import TextInput from '@/Components/Forms/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import ErrorDialogs from '@/Components/Toasts/ErrorDialogs';
import { useState } from "react";
import {
    LogIn
} from "lucide-react";


export default function FinalLoginDc({ status }) {
    const { url } = usePage();
    const [data, setData] = useState({
        username: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errorDialog, setErrorDialog] = useState(false);
    const [errorLogs, setErrorLogs] = useState('');


    const CloseErrorDialog = () => {
        setErrorDialog(false);
    };
    const showErrorDialog = () => {
        setErrorDialog(true);
    };


    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };
    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        const urlParts = window.location.href.split("/");
        const id = urlParts[urlParts.length - 1];
        axios
            .post("/login", data)
            .then((res) => {
                setProcessing(false);
                if(res.data){
                     window.location.href = '/dc/view-final-review-document/'+id;
                }
            })
            .catch((err) => {
                setErrors(err.response.data.errors);
                setProcessing(false);
                console.log(err.response.data.errors.logs)
                if(err.response.data.errors.logs){
                    setErrorLogs(err.response.data.errors.logs)
                    showErrorDialog();
                }
            });
    };



    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="username" value="Employee ID" className=' text-black' />

                    <TextInput
                        id="username"
                        type="username"
                        name="username"
                        value={data.username}
                        className="mt-1  w-full"
                        autoComplete="username"
                        onChange={handleChange}
                    />

                    <InputError message={errors.username ? 'Invalid Employee ID' : ''} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" className=' text-black' />

                    <TextInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full text-black"
                        autoComplete="current-password"
                        onChange={handleChange}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                        />
                        <span className="ms-2 text-xs  text-black ">
                            Show Password
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex  justify-end">

                    <PrimaryButton className="m-auto bg-sky-600" disabled={processing}>
                        {processing ? <div className="animate-spin rounded-full h-3 w-4 border-t-2 border-b-2 border-white"></div> :
                            <div>
                                <LogIn
                                    size={20}
                                    strokeWidth={1}
                                    className="mr-2"
                                    color="#c7c7c7"
                                />

                            </div>}
                                <span className=' text-white nunito-bold mx-2'>Log in</span>
                    </PrimaryButton>
                </div>
            </form>
            <ErrorDialogs show={errorDialog} onClose={CloseErrorDialog} message={errorLogs}></ErrorDialogs>
        </GuestLayout>
    );
}
