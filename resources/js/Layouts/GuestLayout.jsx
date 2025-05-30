import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useLottie } from "lottie-react";
import ApplicationLogo from "@/Components/displays/ApplicationLogo";
import ApplicationLogoSecondary from "@/Components/displays/ApplicationLogoSecondary";

export default function GuestLayout({ children }) {
    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {
        fetch("/lotties/dashboard.json")
            .then((response) => response.json())
            .then((data) => setDashboard(data));
    }, []);

    const options = {
        animationData: dashboard,
        loop: true,
    };
    const { View } = useLottie(options);

    return (
        <div className="flex min-h-screen flex-col items-center pt-6 justify-center sm:pt-0 roboto-thin bg-custom-radial">
            <div className="md:w-3/6 w-5/6 grid md:grid-cols-2 glass rounded-xl shadow-2xl">
                <div className="p-10 flex-row hidden md:block">
                    <ApplicationLogoSecondary width={'150px'} ></ApplicationLogoSecondary>
                    <div className="pb-10 flex justify-center items-center min-h-full">
                        {View}
                    </div>
                </div>
                <div className="md:py-5 py-10 md:px-10 px-5 flex justify-center items-center  bg-white text-black  rounded-e-lg rounded-s-lg md:rounded-s-none">
                    <div className="mt-[-10px] w-full px-5 py-10">
                        <div className="w-full mb-4 md:block hidden">
                            <div className="relative w-20 h-20 overflow-hidden bg-blue-200 rounded-full dark:bg-gray-600 m-auto">
                                <svg className="absolute w-25 h-25 text-blue-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" ></path></svg>
                            </div>
                        </div>
                        <div className="w-full flex justify-center">
                            <ApplicationLogo width={'200px'} className=" block md:hidden mb-2"></ApplicationLogo>
                        </div>
                        <div className="text-center md:mb-5 mb-3">
                            <span className="text-2xl font-medium nunito-bold ">Welcome</span> <br />
                            <span className="text-xs font-medium">Sign in to your account</span>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
