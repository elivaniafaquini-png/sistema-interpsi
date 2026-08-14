import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Instituto InterPsi',
  description: 'Sistema de Gestão Clínica e Neuropsicologia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif', backgroundColor: '#f8fafc', color: '#1e293b', display: 'flex', minHeight: '100vh' }}>
        
        {/* Menu Lateral Organizado */}
        <aside style={{ width: '280px', backgroundColor: '#ffffff', borderRight: '1px solid #cbd5e1', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh', position: 'sticky', top: 0, boxSizing: 'border-box' }}>
          <div>
            <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 4px 0', lineHeight: '1.4' }}>
                Instituto InterPsi
              </h2>
              <p style={{ fontSize: '11px', color: '#0284c7', fontWeight: '600', margin: 0, lineHeight: '1.3' }}>
                Psicologia Clínica e Neuropsicologia
              </p>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: '#334155', textDecoration: 'none' }}>
                <span>🏠</span> Início
              </Link>
              <Link href="/atendimentos" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: '#334155', textDecoration: 'none' }}>
                <span>📊</span> Atendimentos
              </Link>
              <Link href="/pacientes" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: '#334155', textDecoration: 'none' }}>
                <span>👥</span> Pacientes
              </Link>
              <Link href="/prontuario" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: '#334155', textDecoration: 'none' }}>
                <span>📁</span> Prontuário
              </Link>
              <Link href="/profissionais" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: '#334155', textDecoration: 'none' }}>
                <span>🩺</span> Profissionais
              </Link>
              <Link href="/financeiro" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: '#334155', textDecoration: 'none' }}>
                <span>💰</span> Financeiro
              </Link>
              <Link href="/documentos" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: '#334155', textDecoration: 'none' }}>
                <span>📄</span> Documentos
              </Link>
            </nav>
          </div>

          <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', fontSize: '12px' }}>
            <p style={{ fontWeight: 'bold', color: '#0f172a', margin: '0 0 2px 0' }}>Elivania de Carvalho Lopes Faquini</p>
            <p style={{ color: '#0284c7', fontWeight: '600', margin: 0 }}>CRP 23/3260</p>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto', boxSizing: 'border-box' }}>
          {children}
        </main>

      </body>
    </html>
  );
}