import React from 'react'

function ViewMore({ className = '', ...props }) {
    return (
        <label className="container ">
            <input type="checkbox" {...props} className='mt-5' />
            <svg className="chevron-down" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg>
            <svg className="chevron-up" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512" transform="rotate(-90 160 256)">
                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path>
            </svg>
        </label>
    )
}

export default ViewMore