import { Bot, Menu, Keyboard, UserSearch, Shield, LogOut, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
    <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60 transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-50 blur transition duration-500"></div>
            <img src={aecLogo} alt="AeC Logo" className="relative h-9 w-auto" />
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <div className="h-4 w-[1px] bg-white/20 mx-2"></div>
            <Bot className="h-4 w-4 text-cyan-400" />
            <span className="font-medium text-slate-200 tracking-wide text-sm">TREINAMENTO</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full px-4 transition-all duration-300" asChild>
            <Link to="/">Início</Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full px-4 transition-all duration-300" asChild>
            <Link to="/agentes">Agentes</Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full px-4 transition-all duration-300" asChild>
            <a href="https://aec-type-boost.lovable.app/" target="_blank" rel="noopener noreferrer">
              <Keyboard className="mr-2 h-4 w-4" />
              Teste Digitação
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full px-4 transition-all duration-300" asChild>
            <a href="https://mapeamentoperfilaec.lovable.app/" target="_blank" rel="noopener noreferrer">
              <UserSearch className="mr-2 h-4 w-4" />
              Mapeamento
            </a>
          </Button>
          {hasRole('admin') && (
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full px-4 transition-all duration-300" asChild>
              <Link to="/admin">
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}
          {hasRole('gestor') && (
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full px-4 transition-all duration-300" asChild>
              <Link to="/gestor">Dashboard Gestor</Link>
            </Button>
          )}
          {hasRole('instrutor') && (
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full px-4 transition-all duration-300" asChild>
              <Link to="/instrutor">Dashboard Instrutor</Link>
            </Button>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && (
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 rounded-full px-6 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40" size="sm" asChild>
              <Link to="/agentes">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat IA
              </Link>
            </Button>
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <span className="text-sm text-slate-300 font-medium">{user?.nomeCompleto}</span>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all duration-300" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full px-6" asChild>
              <Link to="/auth">Login</Link>
            </Button>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-slate-300 hover:text-white hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] bg-slate-950 border-r border-white/10 text-slate-200">
            <nav className="flex flex-col gap-2 mt-8">
              <Link to="/" className="flex items-center gap-3 mb-8 px-2">
                <img src={aecLogo} alt="AeC Logo" className="h-8 w-auto" />
                <div className="flex flex-col">
                  <span className="font-bold text-white tracking-wide">AeC</span>
                  <span className="text-xs text-cyan-400 font-medium tracking-wider">TREINAMENTO</span>
                </div>
              </Link>
              <div className="flex flex-col gap-1">
                <Button variant="ghost" className="justify-start text-slate-300 hover:text-white hover:bg-white/10 rounded-lg" asChild>
                  <Link to="/">Início</Link>
                </Button>
                <Button variant="ghost" className="justify-start text-slate-300 hover:text-white hover:bg-white/10 rounded-lg" asChild>
                  <Link to="/agentes">Agentes</Link>
                </Button>
                <Button variant="ghost" className="justify-start text-slate-300 hover:text-white hover:bg-white/10 rounded-lg" asChild>
                  <a href="https://aec-type-boost.lovable.app/" target="_blank" rel="noopener noreferrer">
                    <Keyboard className="mr-2 h-4 w-4" />
                    Teste Digitação
                  </a>
                </Button>
                <Button variant="ghost" className="justify-start text-slate-300 hover:text-white hover:bg-white/10 rounded-lg" asChild>
                  <a href="https://mapeamentoperfilaec.lovable.app/" target="_blank" rel="noopener noreferrer">
                    <UserSearch className="mr-2 h-4 w-4" />
                    Mapeamento
                  </a>
                </Button>
                {hasRole('admin') && (
                  <Button variant="ghost" className="justify-start text-slate-300 hover:text-white hover:bg-white/10 rounded-lg" asChild>
                    <Link to="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                )}
                {hasRole('gestor') && (
                  <Button variant="ghost" className="justify-start text-slate-300 hover:text-white hover:bg-white/10 rounded-lg" asChild>
                    <Link to="/gestor">Dashboard Gestor</Link>
                  </Button>
                )}
                {hasRole('instrutor') && (
                  <Button variant="ghost" className="justify-start text-slate-300 hover:text-white hover:bg-white/10 rounded-lg" asChild>
                    <Link to="/instrutor">Dashboard Instrutor</Link>
                  </Button>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
