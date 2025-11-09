import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function PlaceholderPage({ title, description, children }: PlaceholderPageProps) {
  return (
    <div className="page-shell">
      <nav className="page-nav">
        <Link to="/">← Voltar</Link>
      </nav>
      <section className="panel">
        <span className="chip">Em breve</span>
        <h1>{title}</h1>
        <p className="subtitle">{description}</p>
        {children}
      </section>
    </div>
  );
}

