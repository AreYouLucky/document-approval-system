import React from 'react'
import MemberTags from '../Partials/MemberTags';

function IQATeam() {
    const personnel = [
        { name: "Benedict P. Cagaanan", position: "Supervising SRS, CRPD", img: "BENEDICT CAGAANAN_ID.png" },
        { name: "Ma. Lotuslei P. Dimagiba", position: "Supervising SRS, CRPD", img: "LOTUS_ID.png" },
        { name: "Lynderlitte M. Maglaque", position: "Supervising SRS, IRAD", img: "LYNDER.png" },
        { name: "Marievic V. Narquita", position: "Supervising SRS, IRAD", img: "MAVIE_ID.png" },
        { name: "Alfon B. Narquita", position: "Senior SRS, OD-MISPS", img: "ALFON_ID.png" },
        { name: "Joy M. Lazcano", position: "Senior SRS, CRPD", img: "JOY_ID.png" },
        { name: "Allan Mauro V. Marfal", position: "IO III, CRPD", img: "MAU_ID.png" },
        { name: "Jasmin Joyce S. Clarin", position: "IO III, CRPD", img: "JASMINE_ID.png" },
        { name: "Allyster A. Endozo", position: "IO III, CRPD", img: "ALYSTER_ID.png" },
        { name: "Resty R. Balila", position: "IO III, CRPD", img: "RESTY_ID.png" },
        { name: "Arjay C. Escondo", position: "ISR III, IRAD", img: "ARJAY_ID.png" },
        { name: "Ma. Teresa M. Rosqueta", position: "AO V, FAD", img: "TESS_ID.png" },
        { name: "Marites B. Pablo", position: "AO V, FAD", img: "PABLO_ID.png" },
        { name: "Jona M. Bernal", position: "AO V, FAD", img: "JONA_ID.png" },
        { name: "Khasian Eunice M. Romulo", position: "SRS II, IRAD", img: "KIESHAN_ID.png" },
        { name: "Irene A. Brillo", position: "SRS II, IRAD", img: "IRENE_ID.png" },
        { name: "Louella Pestaño", position: "SRS II, IRAD", img: "ELLA_ID.png" },
        { name: "Jonathan D. Abalon", position: "SRS II, IRAD", img: "NATHAN_ID.png" },
        { name: "Philip S. Tumbali", position: "AO IV, FAD", img: "PHILIP_ID.png" },
        { name: "Precious Gayle Arielle C. Balgua", position: "AO IV, FAD", img: "GAYLE_ID.png" },
        { name: "Jozah L. Avanzado", position: "AO IV, FAD", img: "DYOSA_ID.png" },
        { name: "Mark Jayson U. Sison", position: "ISA II, OD-MISPS", img: "MJ_ID.png" },
        { name: "Carmela P. Aguisanda", position: "IO II, CRPD", img: "MELA_ID.png" },
        { name: "Rosemarie C. Señora", position: "SRS I, CRPD", img: "ROSE_ID.png" },
        { name: "Jean Marie C. Errasquin", position: "AO I, FAD", img: "JEAN MARIE_ID.png" },
    ];

    return (
        <div className='w-full max-w-[100vw] md:max-w-[70vw] lg:max-w-[80vw] mx-auto px-9 p-1 mb-10'>
            <div className="py-10 px-4 mx-auto  text-center relative w-full nunito-thin bg-gray-50 dark:bg-gray-800 rounded-lg border shadow-sm">
                <span className="mb-2 text-lg roboto-bold font-bold tracking-tight leading-none text-gray-700 md:text-2xl dark:text-white ">
                    Internal Quality Audit Team <br /> <span className='text-lg text-gray-500 dark:text-gray-300'>(Members)</span>
                </span>
                <div className='w-full grid lg:grid-cols-9 md:grid-cols-5 grid-cols-2 gap-2 mt-5'>
                    {
                        personnel.map((person, index) => (

                            <div key={index} className='flex justify-center align-center '>
                                <MemberTags name={person.name} position={person.position} img={person.img} />
                            </div>
                        ))
                    }

                </div>
            </div>
        </div>
    )
}

export default IQATeam