import Checkbox from '@/Components/Forms/Checkbox';
import InputError from '@/Components/Forms/InputError';
import InputLabel from '@/Components/Forms/InputLabel';
import PrimaryButton from '@/Components/Forms/PrimaryButton';
import TextInput from '@/Components/Forms/TextInput';
import EnterCodeLayout from '@/Layouts/EnterCodeLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import ErrorDialogs from '@/Components/Toasts/ErrorDialogs';
import { useState } from "react";
import {
    LogIn
} from "lucide-react";


export default function Login({ status, canResetPassword }) {
    const { url } = usePage();
    const [data, setData] = useState({
        code: "",
    });
    const [errors, setErrors] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errorDialog, setErrorDialog] = useState(false);

    const CloseErrorDialog = () => {
        setErrorDialog(false);
    };
    const showErrorDialog = () => {
        setErrorDialog(true);
    };


    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        setErrors('');
    };
    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        axios
            .post("/qmr/submit-code", data)
            .then((res) => {
                setProcessing(false);
                window.location.href = '/qmr/view-document/'+data.code;
            })
            .catch((err) => {
                setErrors('Invalid Code');
                setProcessing(false);
                showErrorDialog();
            });
    };



    return (
        <EnterCodeLayout>
            <Head title="QMR Code" />
            <form onSubmit={submit}>
                <div className='my-4'>

                    <TextInput
                        id="code"
                        type="code"
                        name="code"
                        value={data.code}
                        className="mt-1  w-full"
                        autoComplete="code"
                        onChange={handleChange}
                        placeholder="Enter Code"
                    />
                    <InputError message={errors ? 'Invalid Code' : ''} className="mt-2" />
                </div>
                <div className="mt-4 flex  justify-end">

                    <PrimaryButton className="m-auto bg-sky-600" disabled={processing}>
                        {processing ? <div className="animate-spin rounded-full h-3 w-4 border-t-2 border-b-2 border-white"></div> :
                            <div>
                                <LogIn
                                    size={20}
                                    strokeWidth={1}
                                    className="mr-2"
                                    color="white"
                                />

                            </div>}
                        <span className=' text-white nunito-bold mx-2'>Proceed</span>
                    </PrimaryButton>
                </div>
            </form>
            <ErrorDialogs show={errorDialog} onClose={CloseErrorDialog} message={errors}></ErrorDialogs>
        </EnterCodeLayout>
    );
}
