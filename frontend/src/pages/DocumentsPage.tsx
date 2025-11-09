import { Link } from 'react-router-dom';

import { DocumentManager } from '../features/documents/DocumentManager';

export function DocumentsPage() {
  return (
    <div className="page-shell">
      <nav className="page-nav">
        <Link to="/">← Voltar</Link>
      </nav>
      <DocumentManager />
    </div>
  );
}

