// Mock users for development - criar alguns usuários de teste
export const initializeMockUsers = () => {
  const existingUsers = localStorage.getItem('nexus_users');
  
  if (!existingUsers) {
    const mockUsers = [
      {
        id: '1',
        nomeCompleto: 'Admin Sistema',
        email: 'admin@aec.com.br',
        password: 'admin123',
        perfilTipo: 'gestor',
        roles: ['admin', 'gestor']
      },
      {
        id: '2',
        nomeCompleto: 'Maria Gestora',
        email: 'gestor@aec.com.br',
        password: 'gestor123',
        perfilTipo: 'gestor',
        roles: ['gestor']
      },
      {
        id: '3',
        nomeCompleto: 'João Instrutor',
        email: 'instrutor@aec.com.br',
        password: 'instrutor123',
        perfilTipo: 'instrutor',
        roles: ['instrutor']
      },
      {
        id: '4',
        nomeCompleto: 'Ana Veterana',
        email: 'veterano@aec.com.br',
        password: 'veterano123',
        matricula: 'VET12345',
        perfilTipo: 'veterano',
        roles: ['veterano']
      },
      {
        id: '5',
        nomeCompleto: 'Carlos Novato',
        email: 'novato@aec.com.br',
        password: 'novato123',
        cpf: '123.456.789-00',
        perfilTipo: 'novato',
        roles: ['novato']
      }
    ];
    
    localStorage.setItem('nexus_users', JSON.stringify(mockUsers));
  }
};
