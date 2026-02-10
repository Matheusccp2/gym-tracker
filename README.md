# 🏋️ Gym Tracker

Um aplicativo web moderno para gerenciar seus treinos de academia, construído com React, TypeScript, TailwindCSS, ShadCN e Firebase.

## ✨ Funcionalidades

- 🔐 **Autenticação completa** - Cadastro e login com Firebase Authentication
- 💪 **Gerenciamento de Treinos** - Crie treinos personalizados com múltiplos exercícios
- 📅 **Agenda Semanal** - Organize seus treinos ao longo da semana
- 🎯 **Interface Moderna** - Design clean e responsivo com ShadCN UI
- 🔄 **Sincronização em Tempo Real** - Dados armazenados no Firebase Firestore

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool ultrarrápida
- **TailwindCSS** - Framework CSS utility-first
- **ShadCN UI** - Componentes React reutilizáveis e acessíveis
- **Firebase** - Backend completo (Authentication + Firestore)
- **React Router** - Navegação entre páginas
- **Lucide React** - Ícones modernos

## 📋 Pré-requisitos

- Node.js 16+ instalado
- Uma conta no [Firebase](https://console.firebase.google.com/)

## 🔧 Configuração do Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative **Authentication** com provedor de Email/Senha
4. Ative **Cloud Firestore** em modo de produção
5. Nas configurações do projeto, copie suas credenciais do Firebase
6. Abra o arquivo `src/lib/firebase.ts` e substitua as credenciais:

```typescript
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_AUTH_DOMAIN_AQUI",
  projectId: "SEU_PROJECT_ID_AQUI",
  storageBucket: "SEU_STORAGE_BUCKET_AQUI",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID_AQUI",
  appId: "SEU_APP_ID_AQUI"
};
```

## 🛠️ Instalação

1. Clone o repositório ou extraia os arquivos
2. Instale as dependências:

```bash
npm install
```

3. Configure o Firebase (veja seção acima)

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

5. Abra seu navegador em `http://localhost:5173`

## 📦 Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `dist/`.

Para testar a build de produção localmente:

```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
gym-tracker/
├── src/
│   ├── components/       # Componentes React
│   │   ├── auth/        # Componentes de autenticação
│   │   ├── schedule/    # Componentes de agenda
│   │   ├── ui/          # Componentes ShadCN UI
│   │   └── workouts/    # Componentes de treinos
│   ├── contexts/        # Contextos React (Auth)
│   ├── lib/             # Utilitários e configurações
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # Serviços Firebase
│   ├── types/           # Definições TypeScript
│   ├── App.tsx          # Componente principal
│   ├── main.tsx         # Ponto de entrada
│   └── index.css        # Estilos globais
├── public/              # Arquivos estáticos
├── index.html           # Template HTML
└── package.json         # Dependências
```

## 🎯 Como Usar

### 1. Cadastro/Login
- Acesse a página inicial
- Crie uma nova conta ou faça login

### 2. Criar Treinos
- Vá para a aba "Meus Treinos"
- Clique em "Novo Treino"
- Dê um nome ao treino (ex: "Treino de Perna")
- Adicione exercícios clicando em "Adicionar Exercício"
- Preencha: nome, séries, repetições e peso

### 3. Organizar Agenda Semanal
- Vá para a aba "Agenda Semanal"
- Selecione um treino para cada dia da semana
- Ou deixe como "Descanso" se preferir

## 🔒 Regras de Segurança do Firestore

Configure as seguintes regras no Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /workouts/{workoutId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /scheduledWorkouts/{scheduleId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 🎨 Personalização

O projeto usa variáveis CSS do ShadCN para temas. Você pode personalizar as cores editando o arquivo `src/index.css`.


## 📧 Suporte

Se tiver problemas ou dúvidas, abra uma issue no repositório.

---

Desenvolvido com ❤️ usando React + TypeScript + Firebase
