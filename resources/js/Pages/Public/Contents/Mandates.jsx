import React from 'react'

function Mandates() {
    return (
        <>
            <div className='w-full dark:text-gray-100 md:my-4 rounded-lg text-gray-800 shadow-md border hover:scale-105 duration-500 '>
                <div className='p-10 rounded-lg w-full bg-white dark:bg-gray-700 relative overflow-y-auto shadow-sm h-full flex items-center justify-center flex-col'>
                    <h2 className='text-center text-base md:text-xl roboto-bold pb-2'>
                        MANDATES
                    </h2>
                    <div className='text-justify roboto-thin md:text-base text-sm leading-relaxed'>
                        The Science and Technology Information Institute has the responsibility to implement the following mandates:
                        <ol className='pl-8 py-2 '>
                            <li className='list-decimal pb-1'>To establish a science and technology databank and library.</li>
                            <li className='list-decimal pb-1'>To disseminate science and technology information.</li>
                            <li className='list-decimal pb-1'>To undertake training on science and technology information.</li>
                        </ol>
                        These mandates are being processed and implemented by the STII’s technical divisions such as, the Information Resources and Analysis Division (IRAD), and the Communication Resources and Production Division (CRPD) with the support of the Finance and Administrative Division (FAD).
                    </div>
                </div>
            </div>
        </>
    )
}

export default Mandates