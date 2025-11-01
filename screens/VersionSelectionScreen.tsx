import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';

interface VersionSelectionScreenProps {
    onSelect: (version: 'sencillo' | 'completo') => void;
}

const VersionSelectionScreen: React.FC<VersionSelectionScreenProps> = ({ onSelect }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="w-full max-w-md p-8 text-center bg-card text-card-foreground rounded-2xl shadow-2xl border">
                <h1 className="text-4xl font-bold text-foreground">¡Bienvenido!</h1>
                <p className="mt-2 text-lg text-muted-foreground">Elija el modo de experiencia que prefiera.</p>
                
                <div className="mt-10 space-y-6">
                    <button
                        onClick={() => onSelect('sencillo')}
                        className="group flex flex-col items-center justify-center w-full p-6 text-center transition duration-300 border-2 border-transparent rounded-lg bg-background hover:bg-accent hover:border-primary hover:shadow-lg"
                    >
                         <Smartphone className="w-12 h-12 mb-3 text-primary" />
                        <h2 className="text-2xl font-semibold text-foreground">Versión Sencilla</h2>
                        <p className="mt-1 text-muted-foreground">Ideal para un registro rápido y fácil.</p>
                    </button>
                    
                    <button
                        onClick={() => onSelect('completo')}
                        className="group flex flex-col items-center justify-center w-full p-6 text-center transition duration-300 border-2 border-transparent rounded-lg bg-background hover:bg-accent hover:border-primary hover:shadow-lg"
                    >
                        <Monitor className="w-12 h-12 mb-3 text-primary" />
                        <h2 className="text-2xl font-semibold text-foreground">Versión Completa</h2>
                        <p className="mt-1 text-muted-foreground">Acceso a funciones, informes mensuales y administración avanzada.</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VersionSelectionScreen;