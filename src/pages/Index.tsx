import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProfileSelector } from "@/components/ProfileSelector";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {!selectedProfile ? (
          <ProfileSelector onSelectProfile={setSelectedProfile} />
        ) : (
          <ChatInterface profile={selectedProfile} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
