// src/ProductList.js
'use client'

import React, { useEffect, useState, useCallback} from 'react';
import useStore from '../store/product';


// YouTube embed component
const VideoEmbed = ( {url} : { url: string } ) => {
  const getVideoId = (link: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = link.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(url);

  if (!videoId) return <div>Invalid video URL</div>;

  return (
    <div className="w-full aspect-video">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="rounded-lg"
        allowFullScreen
      />
    </div>
  );
};



const ProductList = (  ) => {
  const { products, page, loading, error, limit, fetchProducts, addProducts } = useStore();  

  // search step1
  const [ searchItem, setSearchItem ] = useState('');
  const [ btnSearchClick, setBtnSearchClick ] = useState(false)

  useEffect(() => {  
    fetchProducts( );  
  }, [] );
 
  const loadMore = () => {
  
    if (searchItem) {
      fetchProducts(products.length / limit, searchItem); // Calculate the current page 
    } else {
      fetchProducts(products.length / limit, null); 
    }
  }; 

  // Scroll handler
  // const handleScroll = useCallback(() => {
  //   if (
  //     window.innerHeight + document.documentElement.scrollTop >=
  //     document.documentElement.offsetHeight - 100 &&
  //     loading !== true 
  //   ) {    
  //     if (searchItem) {

  //       console.log('goi search Item: ' + searchItem)
  //       fetchProducts(products.length / limit, searchItem); // Calculate the current page 
        
  //     } else {
  //       console.log('goi binh thupng')
  //       fetchProducts(products.length / limit, null);
  //     }
      
  //   }
  // }, [products, loading, fetchProducts]);
  
  // Scroll event listener
  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [handleScroll]);
  
    
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => { 
    setSearchItem(event.target.value)
  }

  const handleClickSearchButton = () => { 

    if (searchItem) {
      fetchProducts(products.length / limit, searchItem); // Calculate the current page 
    } else {
      fetchProducts(products.length / limit, null);
    }
  }

  const handleReset = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSearchItem('')
    fetchProducts(0, null);
  } 

  // useEffect(() => {
  //   addProducts();
  // }, [addProducts]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>  
      <div className="m-4">
        <div className="flex gap-4">
        <input
          type="text"
          value={ searchItem } 
          onChange={ handleSearch }
        
          className="w-full p-2 bg-white border-none rounded-md shadow-lg"
          placeholder="Tìm sản phẩm / Search products"
        />
        <button onClick={ handleClickSearchButton } className="hover:cursor-pointer w-[200px] hover:bg-green-400 bg-green-600 p-2 rounded-md text-white" > Tìm kiếm </button>
        <button type="reset" onClick={ handleReset } className="hover:cursor-pointer w-[200px] hover:bg-green-400 bg-green-600  p-2 rounded-md text-white" > Reset </button>
      </div>
    </div>

    <ul className="grid grid-cols-1 gap-4 shadow-lg lg:grid-cols-2">
        {products.map( (product : any, index : number ) => (
         <li key={ index } className="p-4 rounded-lg ">
                <div className='p-2 mb-2 text-white bg-blue-700 rounded-md shadow-xl/30'>
                  <strong className="mb-2 text-lg font-semibold uppercase">[{product.id}]  {product.title}</strong>
                </div> 
                <div className="space-x-2 space-y-2">  
                  {product.videoLink && ( 
                    <VideoEmbed url={ product.videoLink } />
                  )}

                  {
                    !product.videoLink && product.description && ( 
                      <div className='p-4 border-4 border-blue-800 rounded-lg shadow-2xl bg-amber-100' dangerouslySetInnerHTML = {{ __html: product.description }}   />
                    )
                  } 

                  {product.affiliateLink && (
                  <a
                    href={product.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white uppercase transition-all duration-300 transform shadow-lg bg-gradient-to-r from-amber-500 to-red-500 rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-amber-100 hover:bg-gradient-to-br group"
                  >
                    {/* Animated border */}
                    <span className="absolute inset-0 transition-all duration-300 rounded-xl -z-10 bg-gradient-to-r from-amber-500 to-red-500 blur-sm group-hover:blur-md group-hover:opacity-75"></span>
                    
                    {/* Button content */}
                    <span className="relative tracking-wider">
                      MUA NGAY - Limited Offer
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

                {product.voucherLink && (
                    <a
                    href={product.voucherLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white uppercase transition-all duration-300 transform shadow-lg bg-gradient-to-r from-green-500 to-blue-500 rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-amber-100 hover:bg-gradient-to-br group"
                  >
                    {/* Animated border */}
                    <span className="absolute inset-0 transition-all duration-300 rounded-xl -z-10 bg-gradient-to-r from-green-500 to-blue-500 blur-sm group-hover:blur-md group-hover:opacity-75"></span>
                    
                    {/* Button content */}
                    <span className="relative tracking-wider">
                      Lấy Voucher - Get Free Voucher
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


       { products.length === 0 && 
        <div className="flex items-center justify-center bg-white h-[300px] text-4xl"> KHÔNG TÌM THẤY SẢN PHẨM </div>
      }

      { products.length > 0 && 
       <button onClick={loadMore} disabled={loading} className='w-full p-2 font-bold text-white uppercase bg-green-600 rounded-md hover:bg-green-300 hover:cursor-pointer'>
          Load More / Xem thêm ...
        </button> 
      }
    </div>
  );
};

export default ProductList;   