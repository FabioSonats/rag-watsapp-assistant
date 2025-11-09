import './App.css';

const roadmap = [
  {
    title: 'Painel de Configurações',
    description:
      'Definir API key da OpenRouter, escolher modelo (GPT-4, Claude, Llama...) e editar prompts de sistema.',
  },
  {
    title: 'RAG de Documentos',
    description:
      'Upload de PDFs/TXTs/Markdown, versionamento, deleção segura e uso como contexto nas respostas.',
  },
  {
    title: 'Integração WhatsApp',
    description:
      'Receber mensagens via Evolution API, processar com IA + RAG e responder em tempo real.',
  },
  {
    title: 'Interface de Testes',
    description:
      'Chat interno com histórico, filtros e telemetria para validar rapidamente as automações.',
  },
];

function App() {
  return (
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
          <button type="button">Iniciar Desenvolvimento</button>
          <a href="https://vercel.com" target="_blank" rel="noreferrer">
            Ver plano de deploy
          </a>
        </div>
      </header>

      <section className="app-content">
        {roadmap.map((item) => (
          <article className="roadmap-card" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <span className="badge">em breve</span>
          </article>
        ))}
      </section>
    </div>
  );
}

export default App;
