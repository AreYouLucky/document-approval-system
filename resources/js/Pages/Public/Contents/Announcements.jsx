import React from 'react'

function Announcements() {
    return (
        <div className='w-full dark:text-gray-100 md:my-4  p-1 rounded-lg text-gray-800 shadow-md border'>
            <div className='md:px-5 px-4 pt-10 rounded-lg w-full bg-white dark:bg-gray-700 h-[580px] relative overflow-y-auto shadow-sm'>
                <h2 className='text-center text-xl roboto-bold dark:text-gray-50 mb-2'><u>Announcements</u></h2>
                <table className="w-full my-2 text-gray-700  table-auto roboto-thin ">
                    <tbody>
                        {[
                            ['08-09 MAY 2025', 'Review of QMS Documents with Consultant', 'Process Owners, QMS Teams & Top Management'],
                            ['31 MAY 2025', 'Submission RAAP and APTAO for 1st semester 2025', 'Process Owners, QMS Teams & Top Management'],
                            ['30 JUNE 2025', '2nd IQA Washup Meeting', 'Process Owners, QMS Teams & Top Management'],
                            ['24 JULY 2025', '2nd IQA Opening Meeting', 'Internal Auditors,Process Owners, QMS Teams & Top Management'],
                            ['30 JULY 2025', '2nd IQA Proper', 'Internal Auditors'],
                        ].map(([date, title, participants], idx) => (
                            <tr key={date} className={`${idx !== 0 ? 'border-y' : ''} hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 duration-200`}>
                                <td className="roboto-bold text-gray-500 dark:text-gray-50 md:text-sm text-xs pr-4 py-3 text-nowrap text-end md:w-[150px] w-[100px] align-center">{date}</td>
                                <td className="py-3">
                                    <div className="roboto-bold text-gray-800 dark:text-white text-sm">{title}</div>
                                    <div className="md:text-sm text-xs text-gray-600 dark:text-gray-50">{participants}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Announcements