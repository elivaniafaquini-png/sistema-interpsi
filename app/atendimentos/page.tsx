import Link from 'next/link';

export default function AtendimentosPage() {
  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', color: '#1e293b' }}>
      <header style={{ marginBottom: '32px', borderBottom: '1px solid #cbd5e1', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#0f172a' }}>
          Tipos de Atendimento
        </h1>
        <p style={{ fontSize: '14px', color: '#0284c7', fontWeight: '600', margin: 0 }}>
          Gerenciamento das modalidades de atendimento do Instituto InterPsi
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        
        {/* Link para Planos de Saúde */}
        <Link href="/atendimentos/planos-de-saude" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', transition: '0.2s' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#0f172a' }}>Planos de Saúde</h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Gerenciamento de convênios e guias.</p>
          </div>
        </Link>

        {/* Link para Particular */}
        <Link href="/atendimentos/particular" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', transition: '0.2s' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#0f172a' }}>Particular</h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Controle de sessões particulares e recibos.</p>
          </div>
        </Link>

        {/* Link para Parcerias */}
        <Link href="/atendimentos/parcerias" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', transition: '0.2s' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#0f172a' }}>Parcerias</h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Gestão de acordos corporativos e institucionais.</p>
          </div>
        </Link>

        {/* Link para Social */}
        <Link href="/atendimentos/social" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', transition: '0.2s' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#0f172a' }}>Social</h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Acompanhamento de projetos e valores sociais.</p>
          </div>
        </Link>

      </div>
    </div>
  );
}