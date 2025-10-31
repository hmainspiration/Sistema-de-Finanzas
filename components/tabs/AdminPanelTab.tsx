import React, { useState } from 'react';
import { Member, Formulas, ChurchInfo } from '../../types';
import { useSupabase } from '../../context/SupabaseContext';
import { UserPlus, Pencil, Trash2, Check, X, Server, Wifi, AlertTriangle } from 'lucide-react';


const SupabaseStatusIndicator: React.FC = () => {
    const { supabase, error } = useSupabase();

    if (error) {
        const isCorsError = error.toLowerCase().includes('failed to fetch');

        return (
            <div className="p-4 text-sm text-left text-red-800 bg-red-100 border border-red-200 rounded-lg dark:bg-red-900/30 dark:text-red-300 dark:border-red-500/50" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold">Error de conexión a la Nube (Supabase)</p>
                    {isCorsError ? (
                        <div className="mt-2 space-y-2">
                            <p><strong>Error detectado:</strong> Falló la conexión (TypeError: Failed to fetch). Este es comúnmente un <strong>problema de CORS</strong>.</p>
                            <p>CORS es un mecanismo de seguridad del navegador que impide que una página web solicite recursos de un dominio diferente. Para solucionarlo, debe autorizar explícitamente el dominio de esta aplicación en la configuración de su proyecto de Supabase.</p>
                            <p className="font-semibold mt-3">Siga estos pasos para solucionarlo:</p>
                            <ol className="list-decimal list-inside space-y-1 pl-2">
                                <li>Vaya a su panel de control de Supabase en <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline dark:text-blue-400">supabase.com</a>.</li>
                                <li>Seleccione su proyecto.</li>
                                <li>En el menú de la izquierda, haga clic en el ícono de <strong>Configuración del Proyecto</strong> (engranaje).</li>
                                <li>Seleccione <strong>API</strong> en la lista de configuraciones.</li>
                                <li>Busque la sección <strong>Configuración de CORS</strong> (Cross-Origin Resource Sharing).</li>
                                <li>En el campo de texto, agregue una nueva línea con <strong className="font-mono bg-gray-200 dark:bg-gray-600 px-1 rounded">*</strong> (un asterisco).</li>
                                <li>Haga clic en <strong>Guardar</strong>.</li>
                            </ol>
                            <p className="mt-3 text-xs"><strong>Nota de Seguridad:</strong> Usar <code className="font-mono">*</code> permite el acceso desde cualquier dominio. Para producción, es más seguro reemplazar el asterisco con la URL específica donde se alojará su aplicación.</p>
                        </div>
                    ) : (
                        <p className="mt-2">{error}</p>
                    )}
                  </div>
                </div>
            </div>
        );
    }

    if (supabase) {
        return (
            <div className="flex items-center gap-4 p-3 bg-green-100 border border-green-200 rounded-lg dark:bg-green-900/30 dark:border-green-500/50">
                <Wifi className="w-5 h-5 text-green-800 dark:text-green-300"/>
                <p className="text-sm text-green-800 dark:text-green-300">Conectado a Supabase exitosamente.</p>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 p-3 bg-yellow-100 border border-yellow-200 rounded-lg dark:bg-yellow-900/30 dark:border-yellow-500/50">
             <Server className="w-5 h-5 text-yellow-800 dark:text-yellow-300"/>
             <p className="text-sm text-yellow-800 dark:text-yellow-300">Inicializando conexión con Supabase...</p>
        </div>
    );
};


const AdminPanelTab: React.FC<{
    members: Member[];
    setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
    categories: string[];
    setCategories: React.Dispatch<React.SetStateAction<string[]>>;
    formulas: Formulas;
    setFormulas: React.Dispatch<React.SetStateAction<Formulas>>;
    churchInfo: ChurchInfo;
    setChurchInfo: React.Dispatch<React.SetStateAction<ChurchInfo>>;
}> = ({
    members, setMembers, categories, setCategories, formulas, setFormulas, churchInfo, setChurchInfo
}) => {
    const { addItem, updateItem, deleteItem } = useSupabase();
    const [newMemberName, setNewMemberName] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [tempFormulas, setTempFormulas] = useState<Formulas>(formulas);
    const [tempChurchInfo, setTempChurchInfo] = useState<ChurchInfo>(churchInfo);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddMember = async () => {
        if (!newMemberName.trim() || members.some(m => m.name.toLowerCase() === newMemberName.trim().toLowerCase())) {
            alert('El nombre del miembro no puede estar vacío o ya existe.');
            return;
        }
        setIsSubmitting(true);
        try {
            const newMember = await addItem('members', { name: newMemberName.trim() });
            setMembers(prev => [...prev, newMember].sort((a,b) => a.name.localeCompare(b.name)));
            setNewMemberName('');
        } catch (error) {
            alert(`Error al agregar miembro: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartEdit = (member: Member) => {
        setEditingMember(JSON.parse(JSON.stringify(member)));
    };

    const handleSaveEdit = async () => {
        if (editingMember) {
            setIsSubmitting(true);
            try {
                const updatedMember = await updateItem('members', editingMember.id, { name: editingMember.name });
                setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
                setEditingMember(null);
            } catch (error) {
                 alert(`Error al guardar cambios: ${error instanceof Error ? error.message : String(error)}`);
            } finally {
                 setIsSubmitting(false);
            }
        }
    };

    const handleDeleteMember = async (id: string) => {
        if (window.confirm("¿Seguro que quiere eliminar este miembro?")) {
            try {
                await deleteItem('members', id);
                setMembers(prev => prev.filter(m => m.id !== id));
            } catch (error) {
                alert(`Error al eliminar miembro: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim() || categories.includes(newCategory.trim())) {
            alert('La categoría no puede estar vacía o ya existe.');
            return;
        }
        setIsSubmitting(true);
        try {
            const newItem = await addItem('categories', { name: newCategory.trim() });
            setCategories(prev => [...prev, newItem.name].sort());
            setNewCategory('');
        } catch (error) {
            alert(`Error al agregar categoría: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteCategory = async (catToDelete: string) => {
        if (window.confirm("¿Seguro que quiere eliminar esta categoría?")) {
            try {
                // We need to find the category's ID to delete it from the DB
                // This is a limitation of storing categories as a simple string array in state.
                // A better approach would be to store them as objects with IDs, like members.
                // For now, we assume names are unique and can be used to find the item to delete.
                const categoryToDelete = await (window as any).supabase.from('categories').select('id').eq('name', catToDelete).single();
                if (categoryToDelete.data) {
                    await deleteItem('categories', categoryToDelete.data.id);
                    setCategories(prev => prev.filter(c => c !== catToDelete));
                } else {
                    throw new Error("Categoría no encontrada en la base de datos.");
                }
            } catch (error) {
                alert(`Error al eliminar categoría: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    };

    const handleFormulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTempFormulas(prev => ({...prev, [name]: parseFloat(value) }));
    };

    const handleSaveFormulas = () => {
        setFormulas(tempFormulas);
        alert("Fórmulas guardadas.");
    };

    const handleChurchInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTempChurchInfo(prev => ({...prev, [name]: value }));
    };

    const handleSaveChurchInfo = () => {
        setChurchInfo(tempChurchInfo);
        alert("Información predeterminada guardada.");
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-indigo-900 dark:text-white">Panel de Administración</h2>

            <div className="p-6 bg-white rounded-xl shadow-lg space-y-4 dark:bg-gray-800">
                <h3 className="text-xl font-bold text-indigo-900 mb-2 dark:text-indigo-300">Conexión a la Nube (Supabase)</h3>
                <SupabaseStatusIndicator />
                 <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">
                    La conexión se establece utilizando las variables definidas en el archivo <code>index.html</code>.
                    Si ve un error, asegúrese de que <code>window.SUPABASE_URL</code> y <code>window.SUPABASE_KEY</code> estén configuradas correctamente en ese archivo.
                </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
                <h3 className="text-xl font-bold text-indigo-900 mb-4 dark:text-indigo-300">Información Predeterminada</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="defaultMinister" value={tempChurchInfo.defaultMinister} onChange={handleChurchInfoChange} placeholder="Nombre Ministro Predeterminado" className="p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"/>
                    <input type="text" name="ministerGrade" value={tempChurchInfo.ministerGrade} onChange={handleChurchInfoChange} placeholder="Grado Ministro" className="p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"/>
                    <input type="text" name="district" value={tempChurchInfo.district} onChange={handleChurchInfoChange} placeholder="Distrito" className="p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"/>
                    <input type="text" name="department" value={tempChurchInfo.department} onChange={handleChurchInfoChange} placeholder="Departamento" className="p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"/>
                    <input type="text" name="ministerPhone" value={tempChurchInfo.ministerPhone} onChange={handleChurchInfoChange} placeholder="Tel. Ministro" className="p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"/>
                </div>
                <button onClick={handleSaveChurchInfo} className="mt-4 w-full sm:w-auto px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors">
                    Guardar Información
                </button>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
                <h3 className="text-xl font-bold text-indigo-900 mb-4 dark:text-indigo-300">Gestionar Miembros</h3>
                <div className="flex gap-2 mb-4">
                    <input type="text" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} placeholder="Nuevo miembro" className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"/>
                    <button onClick={handleAddMember} disabled={isSubmitting} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                        <UserPlus className="w-5 h-5" />
                    </button>
                </div>
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {members.map(m => (
                        <li key={m.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md dark:bg-gray-700/50">
                            {editingMember?.id === m.id ? (
                                <>
                                    <input 
                                        type="text"
                                        value={editingMember.name}
                                        onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                                        className="flex-grow p-1 border border-blue-400 rounded-md bg-white dark:bg-gray-600 dark:border-blue-500 dark:text-gray-100"
                                        autoFocus
                                    />
                                    <div className="flex items-center gap-2 ml-2">
                                        <button onClick={handleSaveEdit} disabled={isSubmitting} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 disabled:text-gray-400"><Check className="w-5 h-5"/></button>
                                        <button onClick={() => setEditingMember(null)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"><X className="w-5 h-5"/></button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className="dark:text-gray-200">{m.name}</span>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => handleStartEdit(m)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"><Pencil className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteMember(m.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"><Trash2 className="w-5 h-5"/></button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
                <h3 className="text-xl font-bold text-indigo-900 mb-4 dark:text-indigo-300">Gestionar Categorías</h3>
                <div className="flex gap-2 mb-4">
                    <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Nueva categoría" className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"/>
                    <button onClick={handleAddCategory} disabled={isSubmitting} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                        <UserPlus className="w-5 h-5" />
                    </button>
                </div>
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {categories.map(c => <li key={c} className="flex justify-between items-center p-2 bg-gray-50 rounded-md dark:bg-gray-700/50"><span className="dark:text-gray-200">{c}</span><button onClick={() => handleDeleteCategory(c)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"><Trash2 className="w-5 h-5"/></button></li>)}
                </ul>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
                <h3 className="text-xl font-bold text-indigo-900 mb-4 dark:text-indigo-300">Gestionar Fórmulas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="diezmoPercentage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Porcentaje Diezmo de Diezmo (%)</label>
                        <input type="number" name="diezmoPercentage" id="diezmoPercentage" value={tempFormulas.diezmoPercentage} onChange={handleFormulaChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                    </div>
                    <div>
                        <label htmlFor="remanenteThreshold" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Umbral Remanente (C$)</label>
                        <input type="number" name="remanenteThreshold" id="remanenteThreshold" value={tempFormulas.remanenteThreshold} onChange={handleFormulaChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                    </div>
                </div>
                <button onClick={handleSaveFormulas} className="mt-4 w-full sm:w-auto px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors">
                    Guardar Fórmulas
                </button>
            </div>
            
        </div>
    );
};

export default AdminPanelTab;