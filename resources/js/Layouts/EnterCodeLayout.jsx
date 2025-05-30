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
            <div className="w-96 rounded-xl shadow-2xl mt-[-10%]">
                <div className="p-5 flex justify-center items-center  bg-white text-black rounded-lg">
                    <div className=" w-full px-5 py-10">
                        <div className="text-center md:mb-2 mb-3 mt-2">
                            <span className="text-2xl font-medium nunito-bold ">Welcome</span>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
