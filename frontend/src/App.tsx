import { Link, Route, Routes } from 'react-router-dom';

import './App.css';
import { DocumentsPage } from './pages/DocumentsPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

const roadmap = [
  {
    title: 'Painel de Configurações',
    description:
      'Conecte OpenRouter e Evolution API, ajuste o modelo padrão e personalize o system prompt.',
    to: '/settings',
    badge: 'em breve',
  },
  {
    title: 'Documentos RAG',
    description:
      'Envie PDFs, textos ou Markdown para alimentar o contexto das respostas e gerencie o acervo.',
    to: '/documents',
    badge: 'disponível',
  },
  {
    title: 'Integração WhatsApp',
    description:
      'Receba mensagens via Evolution API, processe com RAG e responda automaticamente aos usuários.',
    to: '/whatsapp',
    badge: 'em breve',
  },
  {
    title: 'Interface de Testes',
    description:
      'Converse com o assistente pelo navegador, visualize histórico e valide fluxos antes de publicar.',
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
        <span className="gradient-text"> IA, RAG e canais em produção</span>
      </h1>
      <p className="subtitle">
        Este painel concentra tudo que você precisa para configurar o assistente, anexar documentos,
        integrar o WhatsApp e testar conversas antes de publicar.
      </p>
      <div className="cta-group">
        <Link className="ghost-button solid" to="/documents">
          Abrir Documentos RAG
        </Link>
        <a href="https://vercel.com" target="_blank" rel="noreferrer" className="ghost-button">
          Ver deploy na Vercel
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
