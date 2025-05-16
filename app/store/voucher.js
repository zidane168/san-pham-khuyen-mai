import { create } from 'zustand';
import { db } from '../src/firebase';
import { addDoc, collection, getDocs, query, limit, startAfter, orderBy } from 'firebase/firestore';
import { vouchersData } from '@/app/data/vouchers'
 
const useStore = create(( set, get ) => ({
    vouchers: [],
    loading: false,
    error: null, 
    
    fetchVouchers: async() => {
        set({ loading: true, error: null })
        try {
            // const vouchersCollection = collection(db, "vouchers");
            // let vouchersQuery = query( vouchersCollection, orderBy('id', 'desc')  )
             
            set((state) => ({
                vouchers: vouchersData.data,
                loading: false, 
                error: null, 
            })) 

        } catch (error) {
            set({error: error.message, loading: false})
        }
    }, 
}));

export default useStore;