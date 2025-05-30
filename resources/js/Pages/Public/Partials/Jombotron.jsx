import { useLottie } from "lottie-react";
import { useEffect, useState } from "react";
function Jombotron() {
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
    const { View } = useLottie(options, {
        width: 400,
        height: 400
    });
    return (
        <div className="w-full bg-gray-100 dark:bg-gray-700 flex justify-center" >
            <section className="w-full items-center grid md:grid-cols-5 grid-cols-1 px-12 py-5  max-w-[100vw] md:max-w-[70vw] lg:max-w-[80vw]">
                <div className="flex-1 text-end mt-7 lg:mt-0 lg:ml-3 col-span-2 order-1 md:order-2 flex justify-center md:justify-end md:pr-20">
                    <img src="/storage/images/stii.png" className="w-8/12 md:w-3/5" />
                </div>
                <div className="space-y-2 flex-1 text-center lg:text-left text-gray-600 dark:text-gray-50 col-span-3 order-2 md:order-1">
                    <h1 className="text-slate-800 dark:text-white font-bold text-2xl md:text-4xl xl:text-5xl roboto-bold max-w-2xl">
                        Quality Management System <span className="text-blue-700">PORTAL</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-200 max-w-4xl leading-relaxed sm:mx-auto lg:ml-0 text-justify">
                        A portal which aims to centralize and automate DOST-STII’s ISO document workflows. It offers secure storage, approvals, version control, role-based access, notifications and audit trails to improve compliance, cut processing times, ease admin work, and help STII’s process owners succeed.
                    </p>
                </div>
            </section>

        </div>
    );

}

export default Jombotron