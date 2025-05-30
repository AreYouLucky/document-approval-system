import React from 'react'

function AffixSignatureNote() {
    return (
        <div className="w-full">
            <div id="dropdown-cta" className="p-2 rounded-lg border bg-gray-50 shadow-sm" role="alert">
                <div className="flex items-center mb-1">
                    <span className="bg-blue-100 text-gray-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-orange-900">Note</span>
                </div>
                <p className="mb-1 text-sm text-slate-800 px-3 text-justify">
                    "To automatically affix a signature, click anywhere in the document where you want it to appear, then click the button below."
                </p>
            </div>
        </div>
    )
}

export default AffixSignatureNote