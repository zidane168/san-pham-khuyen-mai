import { useEffect } from "react";
import useStore from "../store/voucher";
import { Product, Voucher } from './../types';

const VoucherList = () => {
    const { vouchers, page, loading, error, fetchVouchers } = useStore();
    
    useEffect(() => {  
        fetchVouchers();  
    }, [] );

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <ul className="shadow-lg">
        {
            vouchers.map((v: Voucher, index: number) => (
                <li key={ index } className="p-4 rounded-lg ">
                <div className='p-2 mb-2 text-white bg-blue-700 rounded-md shadow-xl/30'>
                    <strong className="mb-2 font-semibold uppercase text-md">{v.title}</strong>
                </div> 
                <div className="space-x-2 space-y-2">  

                    {
                    !v.videoLink && v.description && ( 
                        <div className='p-4 border-4 border-blue-800 rounded-lg shadow-2xl bg-amber-100' dangerouslySetInnerHTML = {{ __html: v.description }}   />
                    )
                    } 

                {v.voucherLink && (
                    <a
                    href={v.voucherLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white uppercase transition-all duration-300 transform shadow-lg bg-gradient-to-r from-green-500 to-blue-500 rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-amber-100 hover:bg-gradient-to-br group"
                    >
                    {/* Animated border */}
                    <span className="absolute inset-0 transition-all duration-300 rounded-xl -z-10 bg-gradient-to-r from-green-500 to-blue-500 blur-sm group-hover:blur-md group-hover:opacity-75"></span>
                    
                    {/* Button content */}
                    <span className="relative tracking-wider">
                        Lấy Mã/Free Voucher
                    </span>
                    
                    {/* Animated arrow icon */}
                    <svg
                        className="relative w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                        ></path>
                    </svg>
                    </a>
                    )}
                </div>
            </li>
        ))}
        </ul>  
    )
}

export default VoucherList;