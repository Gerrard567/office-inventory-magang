import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from './services/firebase';
import Header from './components/layout/Header';
import Controls from './components/layout/Controls';
import InventoryTable from './components/inventory/InventoryTable';
import ItemFormModal from './components/modals/ItemFormModal';
import AiInputModal from './components/modals/AiInputModal';
import CategoryManagerModal from './components/modals/CategoryManagerModal';
import ConfirmationModal from './components/modals/ConfirmationModal';
import Login from './components/auth/Login';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Notification from './components/ui/Notification';

const DEFAULT_CATEGORIES = ['ATK', 'Pantry', 'Elektronik', 'Aset', 'Lainnya'];

function App() {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

    // Filters
    const [currentCategory, setCurrentCategory] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Notifications & Confirmations
    const [notification, setNotification] = useState(null);
    const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, itemId: null });

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type, id: Date.now() });
    };

    // Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Fetch Data (only if user is logged in)
    useEffect(() => {
        if (!user) {
            setItems([]);
            return;
        }

        const q = query(collection(db, 'inventory'), orderBy('name'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const itemsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setItems(itemsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching inventory:", error);
            setLoading(false);
            showNotification("Gagal memuat data inventaris", "error");
        });

        return () => unsubscribe();
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    // CRUD Operations
    const handleAddItem = async (newItem) => {
        try {
            await addDoc(collection(db, 'inventory'), newItem);
            showNotification(`Barang "${newItem.name}" berhasil ditambahkan!`, "success");
        } catch (error) {
            console.error("Error adding item:", error);
            showNotification("Gagal menambahkan barang", "error");
        }
    };

    // Special handler for AI Input to merge duplicates
    const handleAiAddItem = async (newItem) => {
        try {
            // Check if item already exists (case-insensitive)
            const existingItem = items.find(
                item => item.name.toLowerCase().trim() === newItem.name.toLowerCase().trim()
            );

            if (existingItem) {
                // Update existing item
                const itemRef = doc(db, 'inventory', existingItem.id);
                // Calculate new quantity
                const quantityChange = parseInt(newItem.quantity) || 0;
                let newQuantity = (parseInt(existingItem.quantity) || 0) + quantityChange;

                // Prevent negative stock
                if (newQuantity < 0) {
                    showNotification(`Gagal: Stok tidak cukup! Stok saat ini: ${existingItem.quantity}, diminta keluar: ${Math.abs(quantityChange)}`, "error");
                    return;
                }

                await updateDoc(itemRef, {
                    quantity: newQuantity,
                });

                const action = quantityChange > 0 ? "ditambahkan ke" : "dikurangi dari";
                showNotification(`Stok barang "${existingItem.name}" berhasil ${action} inventaris.`, "success");
            } else {
                // Create new item
                await addDoc(collection(db, 'inventory'), newItem);
                showNotification(`Barang baru "${newItem.name}" berhasil dibuat!`, "success");
            }
        } catch (error) {
            console.error("Error processing AI item:", error);
            showNotification("Gagal memproses barang dari AI", "error");
        }
    };

    const handleUpdateItem = async (updatedItem) => {
        try {
            const itemRef = doc(db, 'inventory', editingItem.id);
            await updateDoc(itemRef, updatedItem);
            setEditingItem(null);
            setIsAddModalOpen(false);
            showNotification("Data barang berhasil diperbarui", "success");
        } catch (error) {
            console.error("Error updating item:", error);
            showNotification("Gagal mengupdate barang", "error");
        }
    };

    // Trigger Delete Modal
    const handleDeleteItem = (id) => {
        setDeleteConfig({ isOpen: true, itemId: id });
    };

    // Actual Delete Logic
    const confirmDelete = async () => {
        if (!deleteConfig.itemId) return;

        try {
            await deleteDoc(doc(db, 'inventory', deleteConfig.itemId));
            showNotification("Barang berhasil dihapus permanen", "success");
            setDeleteConfig({ isOpen: false, itemId: null });
        } catch (error) {
            console.error("Error deleting item:", error);
            showNotification("Gagal menghapus barang", "error");
        }
    };

    const handleUpdateStock = async (id, change) => {
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

    // Category Management (Local state for now, could be Firebase)
    const handleAddCategory = (newCat) => {
        if (!categories.includes(newCat)) {
            setCategories([...categories, newCat]);
            showNotification("Kategori baru ditambahkan", "success");
        }
    };

    const handleDeleteCategory = (catToDelete) => {
        setCategories(categories.filter(c => c !== catToDelete));
        if (currentCategory === catToDelete) setCurrentCategory('Semua');
        showNotification("Kategori dihapus", "success");
    };

    // Filter Logic
    const filteredItems = items.filter(item => {
        const matchesCategory = currentCategory === 'Semua' || item.category === currentCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Stats
    const totalItems = items.length;
    const lowStockCount = items.filter(i => i.quantity <= i.minStock).length;

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <LoadingSpinner />
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            {notification && (
                <Notification
                    key={notification.id}
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <Header totalItems={totalItems} lowStockCount={lowStockCount} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <Controls
                    categories={['Semua', ...categories]}
                    currentCategory={currentCategory}
                    setCategory={setCurrentCategory}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onOpenAiModal={() => setIsAiModalOpen(true)}
                    onOpenAddModal={() => {
                        setEditingItem(null);
                        setIsAddModalOpen(true);
                    }}
                    onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
                />

                <InventoryTable
                    items={filteredItems}
                    loading={loading}
                    onEdit={(item) => {
                        setEditingItem(item);
                        setIsAddModalOpen(true);
                    }}
                    onDelete={handleDeleteItem}
                    onUpdateStock={handleUpdateStock}
                />
            </main>

            {/* Modals */}
            <ItemFormModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                }}
                onSubmit={editingItem ? handleUpdateItem : handleAddItem}
                initialData={editingItem}
                categories={categories}
            />

            <AiInputModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                onAddItems={handleAiAddItem}
            />

            <ConfirmationModal
                isOpen={deleteConfig.isOpen}
                onClose={() => setDeleteConfig({ isOpen: false, itemId: null })}
                onConfirm={confirmDelete}
                title="Hapus Barang?"
                message="Tindakan ini tidak dapat dibatalkan. Barang akan dihapus permanen dari database."
            />

            <CategoryManagerModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                categories={categories}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
            />
        </div>
    );
}

export default App;
