// Fix: Created a functional header component.
import React from 'react';
import { Sun, Moon, RotateCw, LogOut } from 'lucide-react';

interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
}
interface HeaderProps {
    onLogout: () => void;
    // FIX: Added missing props for version switching and theme toggling.
    onSwitchVersion: () => void;
    showSwitchVersion: boolean;
    theme: string;
    toggleTheme: () => void;
    // Added for top navigation
    navItems: NavItem[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
    onLogout, 
    onSwitchVersion, 
    showSwitchVersion, 
    theme, 
    toggleTheme,
    navItems,
    activeTab,
    setActiveTab
}) => {
    return (
        <header className="bg-card shadow-md sticky top-0 z-20 border-b">
            <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-foreground">Sistema de Finanzas</h1>
                </div>
                <div className="flex items-center gap-2">
                    {showSwitchVersion && (
                        <button
                            onClick={onSwitchVersion}
                            className="flex items-center gap-2 p-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
                            aria-label="Cambiar versión"
                            title="Cambiar versión"
                        >
                            <RotateCw className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-2 p-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
                        aria-label="Cambiar tema"
                        title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
                    >
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
                        aria-label="Cerrar sesión"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="hidden sm:inline">Salir</span>
                    </button>
                </div>
            </div>
            <nav className="border-t border-border">
                <div className="flex justify-around max-w-4xl mx-auto">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors duration-200 ${
                            activeTab === item.id ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'
                            }`}
                        >
                            <item.icon className="w-6 h-6 mb-1" />
                            <span>{item.label}</span>
                             {activeTab === item.id && <div className="w-full h-1 mt-1 rounded-full bg-primary"></div>}
                        </button>
                    ))}
                </div>
            </nav>
        </header>
    );
};

export default Header;