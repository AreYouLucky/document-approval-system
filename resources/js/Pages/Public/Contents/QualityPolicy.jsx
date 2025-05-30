import React from 'react'

function QualityPolicy() {
    return (
        <div className='w-full   dark:text-gray-100 md:py-8 py-6 px-10 rounded-lg text-gray-800 '  >
            <h2 className='text-center text-2xl roboto-bold pb-2'>
                Quality Policy
            </h2>
            <p className='text-justify roboto-thin '>
                We, the management and employees of DOST-STII, are committed to establish a science and technology databank and library, disseminate, and undertake training on science and technology information, and other related services to the private and government sectors, according to the core values stated below that define what the agency believes in and how it relates with its stakeholders:
            </p>
            <table className="w-full my-4 text-gray-700 table-auto roboto-thin">
                <tbody>
                    {[
                        ['SERVICE', 'Adheres to the basic principle of public office in delivering relevant, inclusive, and sustainable STI-driven services'],
                        ['COMMITMENT', 'Demonstrate dedication in providing the best STI-driven solutions to the country\'s current, emerging, and anticipated needs'],
                        ['INNOVATION', 'Adds value by pursuing continuous improvement of policies, products, and services'],
                        ['ETHICS', 'Upholds ethical standards and integrity in all stages of scientific practice'],
                        ['NURTURANCE', 'Promotes a safe and healthy environment for developing and nurturing scientific talents'],
                        ['COLLABORATION', 'Engages competent people to achieve common goals and advance S&T progress'],
                        ['EXCELLENCE', 'Fosters a culture of achievement and improved performance to attain the highest level of client satisfaction']
                    ].map(([title, description], idx) => (
                        <tr key={title} className={`${idx === 0 ? 'mt-0' : 'mt-1'} gap-4 pl-6  `}>
                            <td className="roboto-bold text-red-500 text-lg pr-4 align-center text-end">{title}</td>
                            <td className='text-gray-700 dark:text-gray-50'>{description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className='text-justify roboto-thin'>
                We are committed to continually improve the effectiveness of our Quality Management System at all times in order to meet customer satisfaction and all regulatory and statutory requirements; to address risks and opportunities; and to pursue the vision and strategic direction of the Institute to be the lead agency in Science, Technology, and Innovation (STI) information geared towards building a culture of STI to accelerate the nation's socio-economic development.
            </p>
        </div>
    )
}

export default QualityPolicy