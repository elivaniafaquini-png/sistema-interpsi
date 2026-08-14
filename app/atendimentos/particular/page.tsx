'use client';
import { useState } from 'react';

export default function ParticularPage() {
  const [paciente, setPaciente] = useState('');
  const [valor, setValor] = useState('');
  const [pagamento, setPagamento] = useState('PIX');
  const [lista, setLista] = useState<any[]>([]);
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paciente || !valor) return;

    if (editandoIndex !== null) {
      const novaLista = [...lista];
      novaLista[editandoIndex] = { paciente, valor, pagamento };
      setLista(novaLista);
      setEditandoIndex(null);
    } else {
      setLista([...lista, { paciente, valor, pagamento }]);
    }

    setPaciente('');
    setValor('');
    setPagamento('PIX');
  };

  const handleEditar = (index: number) => {
    setPaciente(lista[index].paciente);
    setValor(lista[index].valor);
    setPagamento(lista[index].pagamento);
    setEditandoIndex(index);
  };

  const handleExcluir = (index: number) => {
    setLista(lista.filter((_, i) => i !== index));
    if (editandoIndex === index) {
      setEditandoIndex(null);
      setPaciente('');
      setValor('');
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', color: '#1e293b', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#0f172a' }}>
        Atendimento Particular
      </h1>
      <p style={{ fontSize: '14px', color: '#0284c7', fontWeight: '600', marginBottom: '24px' }}>
        Cadastro e controle de sessões e valores pactuados
      </p>

      <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#0f172a' }}>
          {editandoIndex !== null ? 'Editar Atendimento' : 'Nova Sessão / Paciente'}
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>Nome do Paciente:</label>
            <input type="text" value={paciente} onChange={(e) => setPaciente(e.target.value)} placeholder="Digite o nome..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>Valor Pactuado (R$):</label>
            <input type="text" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Ex: 150,00" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#334155' }}>Forma de Pagamento:</label>
          <select value={pagamento} onChange={(e) => setPagamento(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', boxSizing: 'border-box' }}>
            <option value="PIX">PIX</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Transferência">Transferência</option>
            <option value="Dinheiro">Dinheiro</option>
          </select>
        </div>

        <button type="submit" style={{ backgroundColor: editandoIndex !== null ? '#10b981' : '#0284c7', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          {editandoIndex !== null ? 'Salvar Alterações' : 'Salvar Atendimento'}
        </button>
      </form>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#0f172a' }}>Atendimentos Cadastrados</h2>
        {lista.length === 0 ? (
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Nenhum atendimento cadastrado ainda.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {lista.map((item, index) => (
              <li key={index} style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                <span><strong>{item.paciente}</strong> - R$ {item.valor} ({item.pagamento})</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEditar(index)} style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Editar</button>
                  <button onClick={() => handleExcluir(index)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Excluir</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}