import React from 'react';
import { Link, router } from '@inertiajs/react';

const PdfCard = ({ data }) => {
    const convertDate = (date) => {
        if (!date) return "";
        const parsedDate = new Date(date);
        return parsedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };


    return (
        <section className="relative md:pt-36 pt-28 shadow-xl rounded-lg max-w-md mx-auto h-[290px] md:h-[250px] border overflow-hidden bg-white dark:bg-transparent">
            <button  onClick={() => window.open('storage/iso_documents/' + data.pdf_dir, '_blank')} className='w-full'>
                <div className="w-full rounded-lg">
                    <div className="absolute top-0 left-0 w-full h-80 rounded-t-lg overflow-hidden z-0 px-10">
                        <img src={'/storage/images/pdf.png'} alt="" className="w-full mt-5 md:h-[35%] h-[35%] object-contain" />
                    </div>
                    <div className="w-full px-4 pb-4 mt-2 pt-2 bg-gray-100 dark:bg-gray-800 rounded-b-lg relative z-10 min-h-[200px]">
                        <div className="text-left nunito-regular">
                            <h3 className="text-xs md:text-sm roboto-bold text-gray-900 dark:text-white mb-1">
                                {data.title} v{data.version_no}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-300">
                                Effectivity Date: {convertDate(data.effectivity_date)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-300">
                                {data.document_type}
                            </p>
                        </div>
                    </div>
                </div>
            </button>
        </section>
    );
};

export default PdfCard;
