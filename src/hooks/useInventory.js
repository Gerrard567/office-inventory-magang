import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../services/firebase';

const DEFAULT_CATEGORIES = ['ATK', 'Pantry', 'Elektronik', 'Aset', 'Lainnya'];

export const useInventory = (user) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type, id: Date.now() });
    };

    const clearNotification = () => setNotification(null);

    // Fetch Data
    useEffect(() => {
        if (!user) {
            setItems([]);
            return;
        }

        const q = query(
            collection(db, 'inventory'),
            where('userId', '==', user.uid)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const itemsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => a.name.localeCompare(b.name));

            setItems(itemsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching inventory:", error);
            setLoading(false);
            showNotification("Gagal memuat data inventaris", "error");
        });

        return () => unsubscribe();
    }, [user]);

    // Add Item
    const addItem = async (newItem) => {
        try {
            await addDoc(collection(db, 'inventory'), { ...newItem, userId: user.uid });
            showNotification(`Barang "${newItem.name}" berhasil ditambahkan!`, "success");
            return true;
        } catch (error) {
            console.error("Error adding item:", error);
            showNotification("Gagal menambahkan barang", "error");
            return false;
        }
    };

    // AI Add Item
    const addAiItem = async (newItem) => {
        try {
            const existingItem = items.find(
                item => item.name.toLowerCase().trim() === newItem.name.toLowerCase().trim()
            );

            if (existingItem) {
                const itemRef = doc(db, 'inventory', existingItem.id);
                const quantityChange = parseInt(newItem.quantity) || 0;
                let newQuantity = (parseInt(existingItem.quantity) || 0) + quantityChange;

                if (newQuantity < 0) {
                    showNotification(`Gagal: Stok tidak cukup! Stok saat ini: ${existingItem.quantity}`, "error");
                    return false;
                }

                await updateDoc(itemRef, { quantity: newQuantity });
                const action = quantityChange > 0 ? "ditambahkan ke" : "dikurangi dari";
                showNotification(`Stok barang "${existingItem.name}" berhasil ${action} inventaris.`, "success");
            } else {
                await addDoc(collection(db, 'inventory'), { ...newItem, userId: user.uid });
                showNotification(`Barang baru "${newItem.name}" berhasil dibuat!`, "success");
            }
            return true;
        } catch (error) {
            console.error("Error processing AI item:", error);
            showNotification("Gagal memproses barang dari AI", "error");
            return false;
        }
    };

    // Update Item
    const updateItem = async (id, updatedData) => {
        try {
            const itemRef = doc(db, 'inventory', id);
            await updateDoc(itemRef, updatedData);
            showNotification("Data barang berhasil diperbarui", "success");
            return true;
        } catch (error) {
            console.error("Error updating item:", error);
            showNotification("Gagal mengupdate barang", "error");
            return false;
        }
    };

    // Delete Item
    const deleteItem = async (id) => {
        try {
            await deleteDoc(doc(db, 'inventory', id));
            showNotification("Barang berhasil dihapus permanen", "success");
            return true;
        } catch (error) {
            console.error("Error deleting item:", error);
            showNotification("Gagal menghapus barang", "error");
            return false;
        }
    };

    // Update Stock
    const updateStock = async (id, change) => {
        const item = items.find(i => i.id === id);
        if (!item) return;

        const newQuantity = Math.max(0, item.quantity + change);
        try {
            await updateDoc(doc(db, 'inventory', id), { quantity: newQuantity });
        } catch (error) {
            console.error("Error updating stock:", error);
            showNotification("Gagal update stok", "error");
        }
    };

    // Category Management
    const addCategory = (newCat) => {
        if (!categories.includes(newCat)) {
            setCategories([...categories, newCat]);
            showNotification("Kategori baru ditambahkan", "success");
        }
    };

    const deleteCategory = (catToDelete) => {
        setCategories(categories.filter(c => c !== catToDelete));
        showNotification("Kategori dihapus", "success");
    };

    return {
        items,
        loading,
        categories,
        notification,
        clearNotification,
        addItem,
        addAiItem,
        updateItem,
        deleteItem,
        updateStock,
        addCategory,
        deleteCategory
    };
};
