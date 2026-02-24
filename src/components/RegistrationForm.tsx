import React, { useState, useRef } from 'react';
import { Camera, Save, User, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import type { Militante } from '../types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function RegistrationForm() {
    const [formData, setFormData] = useState({
        dni: '',
        nombres: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
    });
    const [foto, setFoto] = useState<string>('');
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'dni' && !/^\d*$/.test(value)) return; // Only numbers for DNI
        if (name === 'dni' && value.length > 8) return; // Max 8 length

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.dni || !formData.nombres || !formData.apellidoPaterno || !formData.apellidoMaterno || !foto) {
            alert('Por favor, complete todos los campos, incluyendo la foto.');
            return;
        }

        setIsSubmitting(true);

        const { dni, nombres, apellidoPaterno, apellidoMaterno } = formData;

        const newMilitante: Militante = {
            id: crypto.randomUUID(),
            dni,
            nombres,
            apellidoPaterno,
            apellidoMaterno,
            fotoBase64: foto,
            fechaRegistro: new Date().toISOString()
        };

        try {
            // Guardar en Firestore
            await addDoc(collection(db, 'militantes'), newMilitante);

            // Mostrar éxito y resetear formulario
            setSuccess(true);
            setFormData({ dni: '', nombres: '', apellidoPaterno: '', apellidoMaterno: '' });
            setFoto('');
            if (fileInputRef.current) fileInputRef.current.value = '';

            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Error al guardar en Firebase:", error);
            alert("Error al guardar el registro en la nube. Verifica la configuración de Firebase.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card glass" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ padding: '2rem 2rem 0', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--jpp-red)', marginBottom: '0.25rem' }}>Registro de Militante</h2>
                <h3 style={{ color: 'var(--jpp-green)', marginBottom: '0.25rem', fontSize: '1.25rem', fontWeight: 800 }}>CÉSAR HUGO TITO ROJAS</h3>
                <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>CANDIDATO A DIPUTADO</h4>
                <p style={{ color: 'var(--text-muted)' }}>Complete los datos para inscribirse en Juntos por el Perú.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
                {success && (
                    <div style={{ backgroundColor: 'var(--jpp-green-light)', color: 'var(--jpp-green-hover)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                        <CheckCircle2 size={20} />
                        Militante registrado exitosamente.
                    </div>
                )}

                <div className="grid-2">
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Subir Fotografía</label>
                        <div
                            style={{
                                border: '2px dashed var(--border-color)',
                                borderRadius: '8px',
                                padding: '2rem',
                                textAlign: 'center',
                                backgroundColor: 'var(--bg-color)',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'border-color 0.3s'
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--jpp-red)'}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                        >
                            {foto ? (
                                <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto', borderRadius: '8px', overflow: 'hidden' }}>
                                    <img src={foto} alt="Vista previa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.75rem', padding: '0.25rem 0' }}>Cambiar Foto</div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--jpp-red-light)', color: 'var(--jpp-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Camera size={24} />
                                    </div>
                                    <span style={{ fontWeight: 500 }}>Haz clic para subir una foto</span>
                                    <span style={{ fontSize: '0.75rem' }}>PNG, JPG de tamaño pasaporte</span>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handlePhotoUpload}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">DNI</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                <FileText size={18} />
                            </div>
                            <input
                                type="text"
                                name="dni"
                                className="form-input"
                                placeholder="Número de DNI"
                                value={formData.dni}
                                onChange={handleInputChange}
                                style={{ paddingLeft: '2.5rem' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Nombres</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                name="nombres"
                                className="form-input"
                                placeholder="Ej. Juan Carlos"
                                value={formData.nombres}
                                onChange={handleInputChange}
                                style={{ paddingLeft: '2.5rem', textTransform: 'capitalize' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Apellido Paterno</label>
                        <input
                            type="text"
                            name="apellidoPaterno"
                            className="form-input"
                            placeholder="Ej. Quispe"
                            value={formData.apellidoPaterno}
                            onChange={handleInputChange}
                            style={{ textTransform: 'capitalize' }}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Apellido Materno</label>
                        <input
                            type="text"
                            name="apellidoMaterno"
                            className="form-input"
                            placeholder="Ej. Mamani"
                            value={formData.apellidoMaterno}
                            onChange={handleInputChange}
                            style={{ textTransform: 'capitalize' }}
                            required
                        />
                    </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {isSubmitting ? 'Registrando...' : 'Registrar Militante'}
                    </button>
                </div>
            </form>
        </div>
    );
}
