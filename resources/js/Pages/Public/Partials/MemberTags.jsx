import React from 'react'
function MemberTags({ name, className, position, img = 'unknown-user.png' }) {
    return (
        <>
            <div className={` w-fit flex flex-col justify-center items-center hover:scale-105 duration-500 nunito-regular ` + className}>
                <div className='rounded-full shadow-lg overflow-hidden w-28 h-28'>
                    <img
                        src={`/storage/images/qms_team/${img}`}
                        alt=""
                        className="w-full h-28 object-cover rounded-lg"
                    />
                </div>
                <div className='md:ml-4 sm:ml-1 flex-1 flex justify-center flex-col mt-2'>
                    <h4 className='font-semibold text-sm'>
                        {name}
                    </h4>
                    <p className=' text-xs'>
                        {position}
                    </p>
                </div>
            </div>

        </>
    )
}


export default MemberTags