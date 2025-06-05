import React from 'react'
import NameTags from '../Partials/NameTags'
function OrganizationalChart() {

    const tagsClass = ' rounded-lg bg-white dark:bg-gray-800 border px-5 pt-6 pb-4 text-gray-700 dark:text-gray-300 '
    const imgClass = ' mb-2  w-full py-3 px-2  '
    const titleClass = ' text-center text-sm md:text-base roboto-bold'
    return (
        <div className='w-full max-w-[100vw] md:max-w-[70vw] lg:max-w-[80vw] mx-auto'>
            <div className="py-5 pt-5 px-4 mx-auto  text-center relative w-full nunito-thin">
                <span className="mb-2 text-xl roboto-bold font-bold tracking-tight leading-none text-gray-700 md:text-3xl dark:text-white ">
                    Quality Management System Core Team
                </span>

                <div className='w-full grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 text-center px-5 pt-8'>
                    <div className='lg:col-span-4 md:col-span-2 mb-2 flex justify-center'>
                        <NameTags name={'Asec. Napolean K. Juanillo, Jr'} position={'TOP MANAGEMENT'} className={'  px-5 py-2 rounded-xl text-gray-700 dark:text-gray-50'} img={'asec.png'}/>
                    </div>
                    <div className={tagsClass}>
                        <div className='w-full mb-2'>
                            <h2 className={titleClass}>RISK MANAGEMENT <br/>COMMITTEE</h2>
                        </div>
                        <NameTags name={'Alan C. Taule'} position={'CHAIRPERSON'} className={imgClass} img={'ALAN_ID.png'}/>
                        <NameTags name={'Rodolfo P. De Guzman'} position={'VICE CHAIRPERSON'} className={imgClass} img={'RODOLFO DE GUZMAN_ID.png'}/>
                    </div>
                    <div className={tagsClass}>
                        <div className='w-full mb-2'>
                            <h2 className={titleClass}>QUALITY MANAGEMENT <br/> REPRESENTATIVE</h2>
                        </div>
                        <NameTags name={'Arlene E. Centeno'} position={'QUALITY MANAGEMENT REPRESENTATIVE'} className={imgClass  }  img={'ARLENE_ID.png'}/>
                        <NameTags name={'Ma. Aurora Fe L. Dayangco'} position={'ASSISTANT QMR'} className={imgClass}  img={'AU_ID.png'}/>
                    </div>
                    <div className={tagsClass}>
                        <div className='w-full mb-2'>
                            <h2 className={titleClass+ ' py-2 '}>DOCUMENT CUSTODIAN</h2>
                        </div>
                        <NameTags name={'Ma. Teresa M. Rosqueta'} position={'DOCUMENT CUSTODIAN'} className={imgClass}  img={'TESS_ID.png'}/>
                        <NameTags name={'Jean Marie C. Errasquin'} position={'ASSISTANT DOCUMENT CUSTODIAN'} className={imgClass}  img={'JEAN MARIE_ID.png'}/>
                    </div>
                    <div className={tagsClass}>
                        <div className='w-full mb-2'>
                            <h2 className={titleClass}>INTERNAL QUALITY <br/> AUDIT</h2>
                        </div>
                        <NameTags name={'Jean B. Arabes'} position={'INTERNAL QUALITY AUDIT HEAD'} className={imgClass}  img={'JEAN1_ID.png'}/>
                        <NameTags name={'Riza C. Francia'} position={'ASSISTANT IQA HEAD'} className={imgClass}  img={'RISA_ID.png'}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrganizationalChart