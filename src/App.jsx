import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './services/firebase';
import { useInventory } from './hooks/useInventory';

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

function App() {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const {
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
    } = useInventory(user);

    // Filters
    const [currentCategory, setCurrentCategory] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, itemId: null });

    // Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
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

    // Handlers
    const handleUpdateItemWrapper = async (updatedItem) => {
        const success = await updateItem(editingItem.id, updatedItem);
        if (success) {
            setEditingItem(null);
            setIsAddModalOpen(false);
        }
    };

    const handleDeleteCategoryWrapper = (catToDelete) => {
        deleteCategory(catToDelete);
        if (currentCategory === catToDelete) setCurrentCategory('Semua');
    };

    const confirmDelete = async () => {
        if (!deleteConfig.itemId) return;
        const success = await deleteItem(deleteConfig.itemId);
        if (success) {
            setDeleteConfig({ isOpen: false, itemId: null });
        }
    };

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
                    onClose={clearNotification}
                />
            )}

            <Header user={user} totalItems={totalItems} lowStockCount={lowStockCount} onLogout={handleLogout} />

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
                    onDelete={(id) => setDeleteConfig({ isOpen: true, itemId: id })}
                    onUpdateStock={updateStock}
                />
            </main>

            <ItemFormModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                }}
                onSubmit={editingItem ? handleUpdateItemWrapper : addItem}
                initialData={editingItem}
                categories={categories}
            />

            <AiInputModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                onAddItems={addAiItem}
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
                onAddCategory={addCategory}
                onDeleteCategory={handleDeleteCategoryWrapper}
            />
        </div>
    );
}

export default App;
