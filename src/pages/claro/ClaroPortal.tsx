import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users,
    GraduationCap,
    Building2,
    FileText,
    KeyRound,
    LayoutDashboard,
    BookOpen
} from 'lucide-react';

const ClaroPortal = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Portal Claro - Agente IA Nexus';
    }, []);

    const modules = [
        {
            title: 'Dashboard',
            description: 'Visão geral e estatísticas',
            icon: LayoutDashboard,
            path: '/claro/dashboard',
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Instrutores',
            description: 'Cadastro e gestão de instrutores',
            icon: Users,
            path: '/claro/instructors',
            color: 'from-purple-500 to-purple-600',
        },
        {
            title: 'Segmentos',
            description: 'Centros de Resultado e operações',
            icon: BookOpen,
            path: '/claro/segments',
            color: 'from-green-500 to-green-600',
        },
        {
            title: 'Turmas',
            description: 'Gestão de turmas de treinamento',
            icon: GraduationCap,
            path: '/claro/classes',
            color: 'from-red-500 to-red-600',
        },
        {
            title: 'Salas',
            description: 'Salas de treinamento',
            icon: Building2,
            path: '/claro/rooms',
            color: 'from-yellow-500 to-yellow-600',
        },
        {
            title: 'Acessos',
            description: 'Solicitações de acesso',
            icon: KeyRound,
            path: '/claro/access',
            color: 'from-orange-500 to-orange-600',
        },
        {
            title: 'Manuais',
            description: 'Documentação e materiais',
            icon: FileText,
            path: '/claro/manuals',
            color: 'from-indigo-500 to-indigo-600',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Portal do Instrutor
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Cliente Claro - Gestão de Treinamentos
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/')}
                        >
                            Voltar ao Hub
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module) => {
                        const Icon = module.icon;
                        return (
                            <Card
                                key={module.path}
                                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary"
                                onClick={() => navigate(module.path)}
                            >
                                <CardHeader>
                                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">{module.title}</CardTitle>
                                    <CardDescription>{module.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                                        Acessar Módulo
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Quick Stats */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Acesso Rápido
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Turmas Ativas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-primary">-</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    Em andamento
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Acessos Pendentes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-orange-500">-</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    Aguardando conclusão
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Treinandos Ativos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-green-500">-</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    Em treinamento
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClaroPortal;
