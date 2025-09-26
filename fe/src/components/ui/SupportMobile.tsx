import React from 'react'
import QRCode from 'react-qr-code'

const SupportMobile = () => {
    return (
        <main className="grid min-h-full place-items-center bg-white rem-6 py-24 sm:py-32 lg:rem-8">
            <div className="text-center">

                <h1 className="mt-4 text-2xl font-semibold tracking-tight text-balance text-gray-900 sm:text-4xl">
                    This application is only supported on real mobile devices.  
                </h1>
                <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                    You can still access it on your phone by scanning the QR code below.
                </p>
                <div className='w-[200rem] m-auto my-2'>
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={window.location.href}
                        viewBox={`0 0 256 256`}
                    />
                </div>
                <div className="mt-4 flex items-center justify-center gap-x-6">
                    <div
                        onClick={() => window.$crisp?.push(["do", "chat:open"])}

                        className="cursor-pointer rounded-md bg-indigo-600 rem-3.5 py-2.5 text-[2.5rem] font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Contact support
                    </div>

                </div>
            </div>
        </main>

    )
}

export default SupportMobile