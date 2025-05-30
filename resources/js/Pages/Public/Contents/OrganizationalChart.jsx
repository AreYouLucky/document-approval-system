import React from 'react'
import NameTags from '../Partials/NameTags'
function OrganizationalChart() {
    return (
        <div className='w-full max-w-[100vw] md:max-w-[70vw] lg:max-w-[80vw] mx-auto'>
            <div className="py-5 pt-5 px-4 mx-auto  text-center relative w-full nunito-thin">
                <span className="mb-2 text-xl roboto-bold font-bold tracking-tight leading-none text-gray-700 md:text-3xl dark:text-white ">
                    Quality Management System Core Team
                </span>

                <div className='w-full grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 text-center px-5 py-8'>
                    <div className='lg:col-span-4 md:col-span-2 mb-2 flex justify-center'>
                        <NameTags name={'Asec. Napolean K. Juanillo, Jr'} position={'TOP MANAGEMENT'} className={'  px-5 py-2 rounded-xl text-gray-700 dark:text-gray-50'} img={'asec.png'}/>
                    </div>
                    <div className='rounded-lg bg-gray-50 dark:bg-gray-800 border px-5 pt-5 pb-3 text-gray-700 dark:text-gray-300'>
                        <div className='w-full mb-2'>
                            <h2 className='text-center text-sm roboto-bold'>RISK MANAGEMENT COMMITTEE</h2>
                        </div>
                        <NameTags name={'Alan C. Taule'} position={'CHAIRPERSON'} className={' mb-2 border-b w-full py-3 px-2 border-gray-300 '} />
                        <NameTags name={'Rodolfo P. De Guzman'} position={'VICE CHAIRPERSON'} className={' mb-2 border-b w-full py-3 px-2 border-gray-300'} />
                    </div>
                    <div className='rounded-lg bg-gray-50 dark:bg-gray-800 border px-5 pt-5 pb-3 text-gray-700 dark:text-gray-300'>
                        <div className='w-full mb-2'>
                            <h2 className='text-center text-sm roboto-bold'>QUALITY MANAGEMENT REPRESENTATIVE</h2>
                        </div>
                        <NameTags name={'Arlene E. Centeno'} position={'QUALITY MANAGEMENT REPRESENTATIVE'} className={' mb-2 border-b w-full py-3 px-2 border-gray-300'} />
                        <NameTags name={'Ma. Aurora Fe L. Dayangco'} position={'ASSISTANT QMR'} className={' mb-2 border-b w-full py-3 px-2 border-gray-300'} />
                    </div>
                    <div className='rounded-lg bg-gray-50 dark:bg-gray-800 border px-5 pt-5 pb-3 text-gray-700 dark:text-gray-300'>
                        <div className='w-full mb-2'>
                            <h2 className='text-center text-sm roboto-bold'>DOCUMENT CUSTODIAN</h2>
                        </div>
                        <NameTags name={'Ma. Teresa M. Rosqueta'} position={'DOCUMENT CUSTODIAN'} className={' mb-2 border-b w-full py-3 px-2 border-gray-300'} />
                        <NameTags name={'Jean Marie C. Errasquin'} position={'ASSISTANT DOCUMENT CUSTODIAN'} className={' mb-2 border-b w-full py-3 px-2 border-gray-300'} />
                    </div>
                    <div className='rounded-lg bg-gray-50 dark:bg-gray-800 border px-5 pt-5 pb-3 text-gray-700 dark:text-gray-300'>
                        <div className='w-full mb-2'>
                            <h2 className='text-center text-sm roboto-bold'>INTERNAL QUALITY AUDIT</h2>
                        </div>
                        <NameTags name={'Jean B. Arabes'} position={'INTERNAL QUALITY AUDIT HEAD'} className={' mb-2 border-b w-full py-3 px-2 border-gray-300'} />
                        <NameTags name={'Riza C. Francia'} position={'ASSISTANT IQA HEAD'} className={' mb-2 border-b w-full py-3 px-2 border-gray-300'} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrganizationalChart