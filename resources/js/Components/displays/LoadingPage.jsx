import React from 'react'

function LoadingPage() {
    return (
        <div className='w-full flex justify-center p-10 border rounded-lg'>
            <div className="load-4">
                <p className='text-2xl font-extrabold '>Uploading file!</p>
                <p className='text-center mb-5'>Please Wait</p>
                <div className="ring-1"></div>
            </div>
        </div>
    )
}

export default LoadingPage
