import { Bot, Menu, Keyboard, UserSearch, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import aecLogo from "@/assets/aec-logo.png";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-4">
          <img src={aecLogo} alt="AeC Logo" className="h-10 w-auto" />
          <div className="hidden lg:flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">NEXUS TREINAMENTO</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-2 flex-1 justify-center">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">Início</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/agentes">Agentes</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="https://aec-type-boost.lovable.app/" target="_blank" rel="noopener noreferrer">
              <Keyboard className="mr-2 h-4 w-4" />
              Teste Digitação
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="https://mapeamentoperfilaec.lovable.app/" target="_blank" rel="noopener noreferrer">
              <UserSearch className="mr-2 h-4 w-4" />
              Mapeamento
            </a>
          </Button>
          {hasRole('admin') && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin">
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}
          {hasRole('gestor') && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/gestor">Dashboard Gestor</Link>
            </Button>
          )}
          {hasRole('instrutor') && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/instrutor">Dashboard Instrutor</Link>
            </Button>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">{user?.nomeCompleto}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">Login</Link>
            </Button>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
