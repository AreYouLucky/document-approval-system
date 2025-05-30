import React from 'react'

function Mandates() {
    return (
        <>
            <div className='w-full text-gray-700 dark:text-gray-50'>
                <h2 className='text-center text-2xl roboto-bold pb-2'>
                    MANDATES
                </h2>
                <p className='text-justify roboto-thin text-base'>
                    The Science and Technology Information Institute has the responsibility to implement the following mandates:
                    <ol className='pl-8 py-2 '>
                        <li className='list-decimal pb-1'>To establish a science and technology databank and library.</li>
                        <li className='list-decimal pb-1'>To disseminate science and technology information.</li>
                        <li className='list-decimal pb-1'>To undertake training on science and technology information.</li>
                    </ol>
                    These mandates are being processed and implemented by the STII’s technical divisions such as, the Information Resources and Analysis Division (IRAD), and the Communication Resources and Production Division (CRPD) with the support of the Finance and Administrative Division (FAD).
                </p>

                {/* <h2 className='text-center text-2xl roboto-bold pb-2 pt-8'>
                    PHILOSOPHY
                </h2>
                <p className='text-justify roboto-thin text-base mb-2'>
                    STII’s philosophy is rooted on its development mission to achieve and maintain S&T informationexcellence and deliver effective and efficient service in an environment where information at the moment of value is key to competitiveness.
                </p>
                <p className='text-justify roboto-thin text-base mb-2'>
                    STII promotes the widespread use of and appreciation for S&T information. Through its continuing resource sharing activities, S&T popularization services, and IT-based solutions, STII makes S&T information more accessible and valuable to all Filipinos.
                </p>
                <p className='text-justify roboto-thin text-base'>
                The STII believes that people are an organization’s most important resource, and maintains a policy to employ and train communication and information professionals who are competent in achieving organizational mandates.
                </p> */}
            </div>
        </>
    )
}

export default Mandates