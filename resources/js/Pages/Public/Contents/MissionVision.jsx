import React from 'react'

function MissionVision() {
    return (
        <>
            <div className='w-full dark:text-gray-100 md:my-4 rounded-lg text-gray-800 shadow-md border hover:scale-105 duration-500 '>
                <div className='p-10 rounded-lg w-full bg-white dark:bg-gray-700 relative overflow-y-auto shadow-sm'>
                    <h2 className='text-center text-base md:text-xl roboto-bold pb-2'>
                        VISION
                    </h2>
                    <p className='text-justify roboto-thin md:text-base text-sm leading-relaxed'>
                        By 2040, we are the lead agency in Science, Technology, and Innovation information geared towards building a culture of STI to accelerate the nation's socio-economic development.
                    </p>

                    <h2 className='text-center text-base md:text-xl roboto-bold pb-2 pt-4'>
                        MISSION
                    </h2>
                    <div className='text-justify roboto-thin md:text-base text-sm md:mb-2 leading-relaxed'>
                        <ul className='pl-3 py-2  dark:text-gray-50'>
                            <li className='list-disc pb-1'>We provide credible and inclusive Science, Technology, and Innovation information through resource sharing and efficient delivery systems;</li>
                            <li className='list-disc pb-1'>We promote public awareness, understanding, and appreciation of Science, Technology, and Innovation and its role in national development; and</li>
                            <li className='list-disc '>We capacitate our key stakeholders as partners and advocates in building a Science, Technology, and Innovation culture.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MissionVision