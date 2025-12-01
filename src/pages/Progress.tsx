import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";

const Progress = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">Meu Progresso</h1>
                <Card className="p-8 text-center">
                    <p className="text-muted-foreground">
                        Página de progresso em desenvolvimento...
                    </p>
                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default Progress;
