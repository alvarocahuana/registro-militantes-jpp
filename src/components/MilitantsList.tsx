import { useState, useEffect } from 'react';
import type { Militante } from '../types';
import { Search, UserX, Lock, Unlock, Loader2, AlertCircle } from 'lucide-react';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function MilitantsList() {
    const [militantes, setMilitantes] = useState<Militante[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const unsubscribe = onSnapshot(collection(db, 'militantes'), (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id // Usar ID del documento de Firestore
                })) as Militante[];

                // Sort by date descending
                data.sort((a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime());

                setMilitantes(data);
                setLoading(false);
                setError(null);
            }, (err) => {
                console.error("Error en lectura en tiempo real:", err);
                setError("Error al conectar con la base de datos.");
                setLoading(false);
            });

            return () => unsubscribe();
        } catch (err) {
            console.error("Error inicializando Firebase:", err);
            setError("Configuración de base de datos faltante o incorrecta.");
            setLoading(false);
        }
    }, []);

    const filteredMilitantes = militantes.filter(m =>
        m.dni.includes(searchTerm) ||
        m.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.apellidoPaterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.apellidoMaterno.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (id: string) => {
        if (!isAdmin) return;
        setItemToDelete(id);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            await deleteDoc(doc(db, 'militantes', itemToDelete));
            setItemToDelete(null);
        } catch (error) {
            console.error("Error eliminando documento:", error);
            alert("Ocurrió un error al intentar eliminar el registro.");
            setItemToDelete(null);
        }
    };

    const toggleAdmin = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAdmin) {
            setIsAdmin(false);
        } else {
            setShowPasswordModal(true);
            setPasswordInput('');
            setPasswordError(false);
        }
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === 'tito2026') {
            setIsAdmin(true);
            setShowPasswordModal(false);
            setPasswordInput('');
        } else {
            setPasswordError(true);
        }
    };

    return (
        <div className="card glass">
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h2 style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>Lista de Militantes Inscritos</h2>
                            <button
                                type="button"
                                onClick={toggleAdmin}
                                style={{ background: 'transparent', border: 'none', color: isAdmin ? 'var(--jpp-green)' : 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
                                title={isAdmin ? "Cerrar sesión de administrador" : "Acceso Administrador"}
                            >
                                {isAdmin ? <Unlock size={18} /> : <Lock size={18} />}
                            </button>
                        </div>
                        <p style={{ color: 'var(--text-muted)' }}>Total de registros: {militantes.length}</p>
                    </div>

                    <div style={{ position: 'relative', flexGrow: 1, maxWidth: '300px' }}>
                        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Buscar por DNI o nombres..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.5rem', marginBottom: 0 }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1.25rem 2rem', fontWeight: 600, color: 'var(--text-muted)' }}>Foto</th>
                            <th style={{ padding: '1.25rem 2rem', fontWeight: 600, color: 'var(--text-muted)' }}>DNI</th>
                            <th style={{ padding: '1.25rem 2rem', fontWeight: 600, color: 'var(--text-muted)' }}>Apellidos y Nombres</th>
                            <th style={{ padding: '1.25rem 2rem', fontWeight: 600, color: 'var(--text-muted)' }}>Fecha Registro</th>
                            {isAdmin && <th style={{ padding: '1.25rem 2rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={isAdmin ? 5 : 4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                        <Loader2 size={32} className="animate-spin" color="var(--jpp-red)" />
                                        <p>Conectando con la base de datos...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={isAdmin ? 5 : 4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--jpp-red)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                        <AlertCircle size={32} />
                                        <p>{error}</p>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Espera a que el administrador termine la configuración del sistema conectándolo a Google.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredMilitantes.length > 0 ? (
                            filteredMilitantes.map((militante) => (
                                <tr key={militante.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color var(--transition-fast)' }} className="hover-bg">
                                    <td style={{ padding: '1.25rem 2rem' }}>
                                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--bg-color)', border: '2px solid var(--jpp-green)' }}>
                                            <img src={militante.fotoBase64} alt={militante.nombres} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 2rem', fontWeight: 500 }}>{militante.dni}</td>
                                    <td style={{ padding: '1.25rem 2rem' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text-main)', textTransform: 'capitalize', fontSize: '1.05rem', whiteSpace: 'nowrap' }}>
                                            {militante.apellidoPaterno} {militante.apellidoMaterno}, <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>{militante.nombres}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 2rem', color: 'var(--text-muted)' }}>
                                        {new Date(militante.fechaRegistro).toLocaleDateString('es-PE')}
                                    </td>
                                    {isAdmin && (
                                        <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleDeleteClick(militante.id)}
                                                style={{ background: 'none', border: 'none', color: 'var(--jpp-red)', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', transition: 'background-color 0.2s' }}
                                                title="Eliminar registro"
                                            >
                                                <UserX size={20} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={isAdmin ? 5 : 4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    {searchTerm ? 'No se encontraron militantes que coincidan con la búsqueda.' : 'Aún no hay militantes registrados. ¡Ve a la sección de registro para empezar!'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Contraseña */}
            {showPasswordModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(4px)'
                }}>
                    <div className="card" style={{ padding: '2rem', width: '90%', maxWidth: '400px' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Lock size={20} color="var(--jpp-red)" />
                            Acceso de Administrador
                        </h3>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Ingrese la contraseña para habilitar las opciones de eliminación.</p>

                        <form onSubmit={handlePasswordSubmit}>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Contraseña..."
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                style={{ marginBottom: '1rem', borderColor: passwordError ? 'var(--jpp-red)' : '' }}
                                autoFocus
                            />
                            {passwordError && <p style={{ color: 'var(--jpp-red)', fontSize: '0.875rem', marginBottom: '1rem', marginTop: '-0.5rem' }}>Contraseña incorrecta.</p>}

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Acceder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación de Eliminación */}
            {itemToDelete && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(4px)'
                }}>
                    <div className="card" style={{ padding: '2rem', width: '90%', maxWidth: '400px', textAlign: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--jpp-red-light)', color: 'var(--jpp-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <UserX size={24} />
                        </div>
                        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>¿Eliminar Militante?</h3>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Esta acción es permanente y no se puede deshacer. Los datos del militante serán borrados del registro local.</p>

                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                            <button className="btn btn-secondary" onClick={() => setItemToDelete(null)}>
                                Cancelar
                            </button>
                            <button className="btn btn-primary" onClick={confirmDelete}>
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{"\
        .hover-bg:hover { background-color: var(--jpp-green-light); }\
      "}</style>
        </div>
    );
}
