import { create } from 'zustand';
import { db } from '../src/firebase';
import { addDoc, collection, getDocs, query, limit, startAfter, orderBy } from 'firebase/firestore';
import { productsData } from '@/app/data/products'

const useStore = create(( set, get ) => ({  // set, get theo thu tu nha, sai la ko hien thi data dau nha
  products: [],
  loading: false,
  error: null,
  lastVisible: null, // To keep track of the last document fetched
  limit: 10, // Number of items per page
  page: 0,

  fetchProducts: async ( page = 0, searchProduct = null ) => {
    set({ loading: true, error: null });
    try { 
      const productsCollection = collection(db, "products");
      if (searchProduct && searchProduct != '' && searchProduct != null) {

        console.log ('goi searchProduct, fetchProducts')
        const querySnapshot = await getDocs(productsCollection);
        const products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filterProducts = products.filter( (prod) => 
          prod.title.toLowerCase().includes( searchProduct.toLowerCase() )
        )

        set ({ products: filterProducts, loading: false })
        return 
      } 
     
      let productsQuery;

      if (page === 0) {

        // First page
        productsQuery = query(productsCollection, orderBy('id', "desc"), limit(get().limit)); 

        if ( searchProduct ) {
          productsQuery = query(
            productsCollection,  
          ); 
        }
       
      } else {

        // Load more  
        productsQuery = query(productsCollection,  orderBy('id', "desc"), limit(get().limit), startAfter(get().lastVisible));
      }
 
      const querySnapshot = await getDocs(productsQuery);
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
 

      // Update lastVisible to the last document fetched
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      set((state) => ({
        products: page === 0 ? products : [...state.products, ...products],
        loading: false,
        lastVisible: lastVisible || get().lastVisible,
        // page: page,

      }));

      page = page + 1
      set((state) => ({
        page: page,
      }))
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  // fetchProducts: async () => {
  //   set({ loading: true, error: null });
  //   try {
  //     const querySnapshot = await getDocs(collection(db, "products"));
  //     const products = querySnapshot.docs.map(doc => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     set({ products, loading: false });
  //   } catch (error) {
  //     set({ error: error.message, loading: false });
  //   }
  // },

  addProducts: async() => {
    set({ loading: true, error: null })

    try {

      const list = productsData;    // products from 
      const productsCollection = collection(db, "products")

      for (const product of productsData.data) {
        await addDoc(productsCollection, product)
      }

      set({ loading: false });
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  }
}));

export default useStore;