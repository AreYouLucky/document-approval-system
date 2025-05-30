import React from 'react'

function MissionVision() {
    return (
        <>
            <div className='w-full  text-gray-700 dark:text-gray-50'>
                <h2 className='text-center text-2xl roboto-bold pb-2'>
                    VISION
                </h2>
                <p className='text-justify roboto-thin text-base'>
                    By 2040, we are the lead agency in Science, Technology, and Innovation information geared towards building a culture of STI to accelerate the nation's socio-economic development.
                </p>

                <h2 className='text-center text-2xl roboto-bold pb-2 pt-4'>
                    MISSION
                </h2>
                <p className='text-justify roboto-thin text-base mb-2 '>
                    <ul className='pl-3 py-2  dark:text-gray-50'>
                        <li className='list-disc pb-1'>We provide credible and inclusive Science, Technology, and Innovation information through resource sharing and efficient delivery systems;</li>
                        <li className='list-disc pb-1'>We promote public awareness, understanding, and appreciation of Science, Technology, and Innovation and its role in national development; and</li>
                        <li className='list-disc '>We capacitate our key stakeholders as partners and advocates in building a Science, Technology, and Innovation culture.</li>
                    </ul>
                </p>
            </div>
        </>
    )
}

export default MissionVision