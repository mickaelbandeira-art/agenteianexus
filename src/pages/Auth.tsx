import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Briefcase } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerType, setRegisterType] = useState<'novato' | 'veterano'>('veterano');
  const [registerData, setRegisterData] = useState({
    nomeCompleto: "",
    email: "",
    password: "",
    matricula: "",
    cpf: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginData.email, loginData.password);
    
    if (success) {
      toast({ title: "Login realizado com sucesso!" });
      navigate("/");
    } else {
      toast({ 
        title: "Erro no login", 
        description: "Email ou senha incorretos",
        variant: "destructive" 
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      nomeCompleto: registerData.nomeCompleto,
      email: registerData.email,
      password: registerData.password,
      perfilTipo: registerType,
      ...(registerType === 'veterano' ? { matricula: registerData.matricula } : { cpf: registerData.cpf })
    };

    const success = await register(data);
    
    if (success) {
      toast({ title: "Cadastro realizado com sucesso!" });
      navigate("/");
    } else {
      toast({ 
        title: "Erro no cadastro", 
        description: "Email já cadastrado ou dados inválidos",
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">NEXUS TREINAMENTO</CardTitle>
            <CardDescription className="text-center">
              Sistema de Treinamento AeC
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input
                      id="login-password"
                      type="password"
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Entrar</Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card 
                      className={`cursor-pointer transition-all ${registerType === 'veterano' ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setRegisterType('veterano')}
                    >
                      <CardContent className="pt-6 text-center">
                        <Briefcase className="h-12 w-12 mx-auto mb-2 text-primary" />
                        <h3 className="font-semibold">Veterano</h3>
                        <p className="text-sm text-muted-foreground">Com matrícula</p>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className={`cursor-pointer transition-all ${registerType === 'novato' ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setRegisterType('novato')}
                    >
                      <CardContent className="pt-6 text-center">
                        <GraduationCap className="h-12 w-12 mx-auto mb-2 text-primary" />
                        <h3 className="font-semibold">Novato</h3>
                        <p className="text-sm text-muted-foreground">Primeira vez</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nome Completo</Label>
                      <Input
                        id="register-name"
                        required
                        value={registerData.nomeCompleto}
                        onChange={(e) => setRegisterData({ ...registerData, nomeCompleto: e.target.value })}
                      />
                    </div>
                    
                    {registerType === 'veterano' ? (
                      <div className="space-y-2">
                        <Label htmlFor="register-matricula">Matrícula</Label>
                        <Input
                          id="register-matricula"
                          required
                          value={registerData.matricula}
                          onChange={(e) => setRegisterData({ ...registerData, matricula: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="register-cpf">CPF</Label>
                        <Input
                          id="register-cpf"
                          required
                          placeholder="000.000.000-00"
                          value={registerData.cpf}
                          onChange={(e) => setRegisterData({ ...registerData, cpf: e.target.value })}
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        required
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <Input
                        id="register-password"
                        type="password"
                        required
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Cadastrar como {registerType === 'veterano' ? 'Veterano' : 'Novato'}
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
