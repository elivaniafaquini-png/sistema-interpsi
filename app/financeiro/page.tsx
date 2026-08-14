'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sua-url-aqui.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sua-chave-aqui'
);

interface Paciente {
  id: string;
  nome: string;
}

interface Lancamento {
  id: string;
  paciente_id: string;
  valor: number;
  data_pagamento: string;
  status: 'Pendente' | 'Pago';
  descricao: string;
  nome_paciente?: string;
}

export default function FinanceiroPage() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Controle de Edição
  const [lancamentoEditandoId, setLancamentoEditandoId] = useState<string | null>(null);

  // Formulário
  const [pacienteId, setPacienteId] = useState('');
  const [valor, setValor] = useState('');
  const [dataPagamento, setDataPagamento] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'Pendente' | 'Pago'>('Pendente');
  const [descricao, setDescricao] = useState('Sessão de Psicoterapia');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    
    // Carregar Pacientes
    const { data: pacData } = await supabase.from('pacientes').select('id, nome').order('nome');
    if (pacData && pacData.length > 0) {
      setPacientes(pacData);
      setPacienteId(pacData[0].id);
    }

    // Carregar Lançamentos Financeiros
    const { data: finData, error } = await supabase
      .from('financeiro')
      .select('*, pacientes(nome)')
      .order('data_pagamento', { ascending: false });

    if (!error && finData) {
      const formatado = finData.map((item: any) => ({
        ...item,
        nome_paciente: item.pacientes?.nome || 'Paciente não identificado'
      }));
      setLancamentos(formatado);
    }
    setLoading(false);
  }

  function abrirModalNovo() {
    setLancamentoEditandoId(null);
    setValor('');
    setDataPagamento(new Date().toISOString().split('T')[0]);
    setStatus('Pendente');
    setDescricao('Sessão de Psicoterapia');
    if (pacientes.length > 0) setPacienteId(pacientes[0].id);
    setModalAberto(true);
  }

  function abrirModalEditar(item: Lancamento) {
    setLancamentoEditandoId(item.id);
    setPacienteId(item.paciente_id);
    setValor(item.valor.toString());
    setDataPagamento(item.data_pagamento);
    setStatus(item.status);
    setDescricao(item.descricao);
    setModalAberto(true);
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    if (!pacienteId || !valor) {
      alert('Preencha o paciente e o valor.');
      return;
    }

    setSalvando(true);

    if (lancamentoEditandoId) {
      // Atualizar registro existente
      const { error } = await supabase
        .from('financeiro')
        .update({
          paciente_id: pacienteId,
          valor: parseFloat(valor),
          data_pagamento: dataPagamento,
          status,
          descricao
        })
        .eq('id', lancamentoEditandoId);

      setSalvando(false);

      if (error) {
        alert('Erro ao atualizar lançamento: ' + error.message);
      } else {
        alert('Lançamento atualizado com sucesso!');
        setModalAberto(false);
        setLancamentoEditandoId(null);
        carregarDados();
      }
    } else {
      // Inserir novo registro
      const { error } = await supabase.from('financeiro').insert([
        {
          paciente_id: pacienteId,
          valor: parseFloat(valor),
          data_pagamento: dataPagamento,
          status,
          descricao
        }
      ]);

      setSalvando(false);

      if (error) {
        alert('Erro ao salvar lançamento: ' + error.message);
      } else {
        alert('Lançamento salvo com sucesso!');
        setModalAberto(false);
        setValor('');
        carregarDados();
      }
    }
  }

  async function handleExcluir(id: string) {
    if (confirm('Tem certeza que deseja excluir este lançamento financeiro?')) {
      const { error } = await supabase.from('financeiro').delete().eq('id', id);
      if (error) {
        alert('Erro ao excluir lançamento: ' + error.message);
      } else {
        carregarDados();
      }
    }
  }

  async function alternarStatus(id: string, statusAtual: string) {
    const novoStatus = statusAtual === 'Pago' ? 'Pendente' : 'Pago';
    const { error } = await supabase.from('financeiro').update({ status: novoStatus }).eq('id', id);
    if (error) alert('Erro ao atualizar status');
    else carregarDados();
  }

  // Totais
  const totalRecebido = lancamentos
    .filter(l => l.status === 'Pago')
    .reduce((acc, l) => acc + Number(l.valor), 0);

  const totalPendente = lancamentos
    .filter(l => l.status === 'Pendente')
    .reduce((acc, l) => acc + Number(l.valor), 0);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 p-6 rounded-xl border border-slate-800 gap-4">
          <div>
            <Link href="/" className="text-sm text-cyan-400 hover:underline mb-2 inline-block">
              ← Voltar ao Início
            </Link>
            <h1 className="text-2xl font-bold">Gestão Financeira</h1>
            <p className="text-slate-400 text-sm">Controle de entradas, recebimentos e pendências</p>
          </div>
          <button
            onClick={abrirModalNovo}
            className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-4 py-2.5 rounded-lg transition"
          >
            + Novo Lançamento
          </button>
        </div>

        {/* Resumo / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <p className="text-sm text-slate-400">Total Recebido (Pago)</p>
            <p className="text-3xl font-bold text-green-400 mt-1">
              R$ {totalRecebido.toFixed(2)}
            </p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <p className="text-sm text-slate-400">Total a Receber (Pendente)</p>
            <p className="text-3xl font-bold text-amber-400 mt-1">
              R$ {totalPendente.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Tabela de Lançamentos */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Carregando financeiro...</div>
          ) : lancamentos.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Nenhum lançamento financeiro registrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-300 border-b border-slate-800">
                  <tr>
                    <th className="p-4">Data</th>
                    <th className="p-4">Paciente</th>
                    <th className="p-4">Descrição</th>
                    <th className="p-4">Valor</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {lancamentos.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-mono">{new Date(item.data_pagamento + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                      <td className="p-4 font-medium">{item.nome_paciente}</td>
                      <td className="p-4 text-slate-400">{item.descricao}</td>
                      <td className="p-4 font-mono font-bold">R$ {Number(item.valor).toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Pago' ? 'bg-green-900/60 text-green-300 border border-green-700' :
                          'bg-amber-900/60 text-amber-300 border border-amber-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-3">
                        <button 
                          onClick={() => alternarStatus(item.id, item.status)}
                          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1 rounded transition"
                        >
                          {item.status === 'Pago' ? 'Marcar Pendente' : 'Marcar Pago'}
                        </button>
                        <button 
                          onClick={() => abrirModalEditar(item)}
                          className="text-cyan-400 hover:underline text-xs font-medium"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleExcluir(item.id)}
                          className="text-red-400 hover:underline text-xs font-medium"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Novo / Editar Lançamento */}
        {modalAberto && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
              <h2 className="text-xl font-bold text-slate-100">
                {lancamentoEditandoId ? 'Editar Lançamento Financeiro' : 'Novo Lançamento Financeiro'}
              </h2>

              <form onSubmit={handleSalvar} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Paciente *</label>
                  <select
                    value={pacienteId}
                    onChange={(e) => setPacienteId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                    required
                  >
                    {pacientes.map((p) => (
                      <option key={p.id} value={p.id}>👤 {p.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Valor (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Data *</label>
                    <input
                      type="date"
                      value={dataPagamento}
                      onChange={(e) => setDataPagamento(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Pendente' | 'Pago')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Pago">Pago</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalAberto(false)}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvando}
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
                  >
                    {salvando ? 'Salvando...' : 'Salvar Lançamento'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}