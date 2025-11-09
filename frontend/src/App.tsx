import { Link, Route, Routes } from 'react-router-dom';

import './App.css';
import { DocumentsPage } from './pages/DocumentsPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

const roadmap = [
  {
    title: 'Painel de Configurações',
    description:
      'Definir API key da OpenRouter, escolher modelo (GPT-4, Claude, Llama...) e editar prompts de sistema.',
    to: '/settings',
    badge: 'em breve',
  },
  {
    title: 'RAG de Documentos',
    description:
      'Upload de PDFs/TXTs/Markdown, versionamento, deleção segura e uso como contexto nas respostas.',
    to: '/documents',
    badge: 'disponível',
  },
  {
    title: 'Integração WhatsApp',
    description:
      'Receber mensagens via Evolution API, processar com IA + RAG e responder em tempo real.',
    to: '/whatsapp',
    badge: 'em breve',
  },
  {
    title: 'Interface de Testes',
    description:
      'Chat interno com histórico, filtros e telemetria para validar rapidamente as automações.',
    to: '/chat',
    badge: 'em breve',
  },
];

const LandingPage = () => (
  <div className="app-shell">
    <header className="app-header">
      <span className="chip">RAG + WhatsApp</span>
      <h1>
        Construindo um assistente contextual com
        <span className="gradient-text"> tons pastéis e UX moderna</span>
      </h1>
      <p className="subtitle">
        Este painel guiará o desenvolvimento das próximas etapas. Tudo foi preparado para escalar
        com clareza nas responsabilidades (domain &gt; services &gt; controllers).
      </p>
      <div className="cta-group">
        <Link className="ghost-button" to="/documents">
          Acessar Documentos
        </Link>
        <a href="https://vercel.com" target="_blank" rel="noreferrer" className="ghost-button">
          Ver plano de deploy
        </a>
      </div>
    </header>

    <section className="app-content">
      {roadmap.map((item) => (
        <Link className="roadmap-card" key={item.title} to={item.to}>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <span className={`badge ${item.badge === 'disponível' ? 'available' : ''}`}>{item.badge}</span>
        </Link>
      ))}
    </section>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route
        path="/settings"
        element={
          <PlaceholderPage
            title="Painel de Configurações"
            description="Em breve será possível editar os prompts e credenciais diretamente pela interface pastel."
          />
        }
      />
      <Route
        path="/whatsapp"
        element={
          <PlaceholderPage
            title="Integração WhatsApp"
            description="O webhook já está ativo; em breve adicionaremos monitoramento e dashboards."
          />
        }
      />
      <Route
        path="/chat"
        element={
          <PlaceholderPage
            title="Interface de Testes"
            description="Uma interface interna de chat será disponibilizada para validar conversas com o assistente."
          />
        }
      />
    </Routes>
  );
}

export default App;
