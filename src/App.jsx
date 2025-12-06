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
import Login from './components/auth/Login';
import LoadingSpinner from './components/ui/LoadingSpinner';

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
        } catch (error) {
            console.error("Error adding item:", error);
            alert("Gagal menambahkan barang");
        }
    };

    const handleUpdateItem = async (updatedItem) => {
        try {
            const itemRef = doc(db, 'inventory', editingItem.id);
            await updateDoc(itemRef, updatedItem);
            setEditingItem(null);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Error updating item:", error);
            alert("Gagal mengupdate barang");
        }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
            try {
                await deleteDoc(doc(db, 'inventory', id));
            } catch (error) {
                console.error("Error deleting item:", error);
                alert("Gagal menghapus barang");
            }
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
        }
    };

    // Category Management (Local state for now, could be Firebase)
    const handleAddCategory = (newCat) => {
        if (!categories.includes(newCat)) {
            setCategories([...categories, newCat]);
        }
    };

    const handleDeleteCategory = (catToDelete) => {
        setCategories(categories.filter(c => c !== catToDelete));
        if (currentCategory === catToDelete) setCurrentCategory('Semua');
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
                onAddItems={handleAddItem}
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

