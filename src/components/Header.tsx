import { Bot, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import aecLogo from "@/assets/aec-logo.png";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4">
          <img src={aecLogo} alt="AeC Logo" className="h-10 w-auto" />
          <div className="hidden md:flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">NEXUS TREINAMENTO</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">Início</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/agentes">Agentes</Link>
          </Button>
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
