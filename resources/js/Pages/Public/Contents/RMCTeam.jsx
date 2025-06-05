import React from 'react'
import MemberTags from '../Partials/MemberTags'

function RMCTeam() {
    return (
        <div className='w-full max-w-[100vw] md:max-w-[70vw] lg:max-w-[80vw] mx-auto px-5 mb-4'>
            <div className="text-center relative w-full nunito-thin  ">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 px-4 gap-4">
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg border shadow-sm  lg:col-span-2  px-5 py-8'>
                        <span className="text-lg roboto-bold font-bold tracking-tight leading-none text-gray-700 md:text-2xl dark:text-white ">
                            Risk Management Committee <br /> <span className='text-lg text-gray-500 dark:text-gray-300'>(Members)</span>
                        </span>
                        <div className='w-full grid lg:grid-cols-4 grid-cols-2 mt-4'>
                            <div className='flex justify-center align-center '>
                                <MemberTags name={'Alfon B. Narquita'} position={'Senior SRS, OD-MISPS'} img={'ALFON_ID.png'} />
                            </div>
                            <div className='flex justify-center align-center '>
                                <MemberTags name={'Benedict P. Cagaanan'} position={'Supervising SRS, CRPD'} img={'BENEDICT CAGAANAN_ID.png'} />
                            </div>
                            <div className='flex justify-center align-center '>
                                <MemberTags name={'Marites B. Pablo'} position={'AO V, FAD'} img={'PABLO_ID.png'} />
                            </div>
                            <div className='flex justify-center align-center '>
                                <MemberTags name={'Arjay C. Escondo'} position={'ISR III, IRAD'} img={'ARJAY_ID.png'} />
                            </div>
                        </div>
                    </div>
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg border shadow-sm  px-5 py-8 h-fit'>
                        <span className="text-lg roboto-bold font-bold tracking-tight leading-none text-gray-700 md:text-2xl dark:text-white ">
                            Risk Management Committee <br /> <span className='text-lg text-gray-500 dark:text-gray-300'>(Secretariat)</span>
                        </span>
                        <div className='w-full grid grid-cols-2 mt-4'>
                            <div className='flex justify-center align-center '>
                                <MemberTags name={'Khasian Eunice M. Romulo'} position={'SRS II, IRAD'} img={'KIESHAN_ID.png'} />
                            </div>
                            <div className='flex justify-center align-center '>
                                <MemberTags name={'Rosemarie C. Señora'} position={' SRS I, CRPD'} img={'ROSE_ID.png'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RMCTeam