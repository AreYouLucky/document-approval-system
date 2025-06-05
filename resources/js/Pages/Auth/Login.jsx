import Checkbox from '@/Components/Forms/Checkbox';
import InputError from '@/Components/Forms/InputError';
import InputLabel from '@/Components/Forms/InputLabel';
import PrimaryButton from '@/Components/Forms/PrimaryButton';
import TextInput from '@/Components/Forms/TextInput';
import GuestDashboardLayout from '@/Layouts/GuestDashboardLayout';
import { Head, Link } from '@inertiajs/react';
import ErrorDialogs from '@/Components/Toasts/ErrorDialogs';
import { useState, useEffect } from "react";
import {LogIn} from "lucide-react";
import ApplicationLogo from "@/Components/displays/ApplicationLogo";


export default function Login({ status }) {

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

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
        axios
            .post("/login", data)
            .then((res) => {
                setProcessing(false);
                if (res.data) {
                    window.location.href = '/dashboard';
                }
            })
            .catch((err) => {
                setErrors(err.response.data.errors);
                setProcessing(false);
                console.log(err.response.data.errors.logs)
                if (err.response.data.errors.logs) {
                    setErrorLogs(err.response.data.errors.logs)
                    showErrorDialog();
                }
            });
    };



    return (
        <GuestDashboardLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
            <div className='w-full min-h-[600px] md:min-h-[700px] flex justify-center items-center'>
                <div className="md:w-2/6 w-5/6  shadow-lg ">
                    <div className="md:py-10 py-10 md:px-10 px-5 flex justify-center items-center rounded-lg  bg-white dark:bg-gray-800 text-black dark:text-gray-50">
                        <div className="mt-[-10px] w-full px-5 py-10">
                            <div className="w-full flex justify-center">
                                <ApplicationLogo width={'200px'} className="  mb-2"></ApplicationLogo>
                            </div>
                            <div className="text-center md:mb-5 mb-3">
                                <span className="text-2xl font-medium nunito-bold ">Welcome</span> <br />
                                <span className="text-xs font-medium">Sign in to your account</span>
                            </div>

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
                                        <span className="ms-2 text-xs  ">
                                            Show Password
                                        </span>
                                    </label>
                                </div>

                                <div className="mt-4 flex  justify-end">

                                    <PrimaryButton className="m-auto bg-blue-500" disabled={processing}>
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
                        </div>
                    </div>
                </div>
            </div>

            <ErrorDialogs show={errorDialog} onClose={CloseErrorDialog} message={errorLogs}></ErrorDialogs>
        </GuestDashboardLayout>
    );
}
