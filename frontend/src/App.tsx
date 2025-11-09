import './App.css';
import { SettingsForm } from './features/settings/SettingsForm';

const roadmap = [
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
  {
    title: 'Métricas e Auditoria',
    description: 'Dashboards de uso, trilhas de auditoria e avaliação contínua das respostas.',
  },
];

function App() {
  return (
    <main className="layout">
      <SettingsForm />
      <aside className="timeline">
        <header>
          <span className="chip">Próximos passos</span>
          <h2>Roadmap do assistente</h2>
          <p>
            Cada etapa adiciona camadas de contexto, automação e visibilidade para facilitar
            integrações futuras com WhatsApp e outros canais.
          </p>
        </header>
        <ul>
          {roadmap.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </aside>
    </main>
  );
}

export default App;
