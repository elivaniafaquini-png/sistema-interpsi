import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', color: '#1e293b' }}>
      
      {/* Cabeçalho da Página */}
      <header style={{ marginBottom: '32px', borderBottom: '1px solid #cbd5e1', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#0f172a' }}>
          Instituto InterPsi
        </h1>
        <p style={{ fontSize: '14px', color: '#0284c7', fontWeight: '600', margin: 0 }}>
          Psicologia Clínica e Neuropsicologia
        </p>
      </header>

      {/* Grid do Dashboard com Links Clicáveis */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* Bloco: Tipos de Atendimento */}
        <Link href="/atendimentos" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%', boxSizing: 'border-box', cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#0f172a' }}>Tipos de Atendimento</h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Planos de saúde, particular, parcerias e social.</p>
          </div>
        </Link>

        {/* Bloco: Pacientes */}
        <Link href="/pacientes" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%', boxSizing: 'border-box', cursor: 'pointer' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#0f172a' }}>Pacientes</h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Gerenciamento completo e histórico dos pacientes.</p>
          </div>
        </Link>

        {/* Bloco: Prontuário */}
        <Link href="/prontuario" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%', boxSizing: 'border-box', cursor: 'pointer' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📁</div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#0f172a' }}>Prontuário</h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Acesse prontuários, evoluções clínicas e laudos.</p>
          </div>
        </Link>

        {/* Bloco: Financeiro */}
        <Link href="/financeiro" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%', boxSizing: 'border-box', cursor: 'pointer' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#0f172a' }}>Financeiro</h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Controle de pagamentos, recebimentos e fluxo de caixa.</p>
          </div>
        </Link>

        {/* Bloco: Profissionais */}
        <Link href="/profissionais" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%', boxSizing: 'border-box', cursor: 'pointer' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🩺</div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#0f172a' }}>Profissionais</h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Gerencie os dados e registros da equipe.</p>
          </div>
        </Link>

        {/* Bloco: Documentos */}
        <Link href="/documentos" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '100%', boxSizing: 'border-box', cursor: 'pointer' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📄</div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#0f172a' }}>Documentos</h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Emissão de declarações, atestados e termos.</p>
          </div>
        </Link>

      </div>
    </div>
  );
}