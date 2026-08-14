'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface Paciente {
  id: string;
  nome: string;
  telefone: string;
  data_nascimento: string;
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Estados para o Modal e Formulário
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarPacientes();
  }, []);

  async function carregarPacientes() {
    setCarregando(true);
    const { data } = await supabase.from('pacientes').select('*').order('nome');
    if (data) setPacientes(data);
    setCarregando(false);
  }

  function abrirModalNovo() {
    setEditandoId(null);
    setNome('');
    setTelefone('');
    setDataNascimento('');
    setModalAberto(true);
  }

  function abrirModalEditar(p: Paciente) {
    setEditandoId(p.id);
    setNome(p.nome || '');
    setTelefone(p.telefone || '');
    setDataNascimento(p.data_nascimento || '');
    setModalAberto(true);
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      alert('O nome do paciente é obrigatório.');
      return;
    }

    setSalvando(true);

    if (editandoId) {
      const { error } = await supabase
        .from('pacientes')
        .update({ nome, telefone, data_nascimento: dataNascimento })
        .eq('id', editandoId);
      
      if (error) alert('Erro ao atualizar: ' + error.message);
    } else {
      const { error } = await supabase
        .from('pacientes')
        .insert([{ nome, telefone, data_nascimento: dataNascimento }]);
      
      if (error) alert('Erro ao cadastrar: ' + error.message);
    }

    setSalvando(false);
    setModalAberto(false);
    carregarPacientes();
  }

  async function handleExcluir(id: string, nomePaciente: string) {
    if (confirm(`Tem certeza que deseja excluir "${nomePaciente}"?`)) {
      const { error } = await supabase.from('pacientes').delete().eq('id', id);
      if (error) {
        alert('Erro ao excluir: ' + error.message);
      } else {
        carregarPacientes();
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link href="/" className="text-sm text-cyan-400 hover:underline">← Voltar ao Início</Link>
            <h1 className="text-2xl font-bold mt-1">Gestão de Pacientes</h1>
            <p className="text-slate-400 text-sm">Cadastro geral e prontuários da clínica</p>
          </div>
          <button
            onClick={abrirModalNovo}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition"
          >
            + Novo Paciente
          </button>
        </div>

        {/* Tabela de Pacientes */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase bg-slate-950/50">
                  <th className="p-4">Nome Completo</th>
                  <th className="p-4">Telefone / WhatsApp</th>
                  <th className="p-4">Data de Nascimento</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {carregando ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-400">Carregando pacientes...</td>
                  </tr>
                ) : pacientes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-400">Nenhum paciente cadastrado.</td>
                  </tr>
                ) : (
                  pacientes.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/50 transition">
                      <td className="p-4 font-medium text-white">{p.nome}</td>
                      <td className="p-4 text-slate-300">{p.telefone || 'Não informado'}</td>
                      <td className="p-4 text-slate-300">
                        {p.data_nascimento ? new Date(p.data_nascimento + 'T00:00:00').toLocaleDateString('pt-BR') : 'Não informada'}
                      </td>
                      <td className="p-4 text-center space-x-2">
                        <button
                          onClick={() => abrirModalEditar(p)}
                          className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleExcluir(p.id, p.nome)}
                          className="bg-slate-800 hover:bg-slate-700 text-red-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition"
                        >
                          🗑️ Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal de Cadastro / Edição */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {editandoId ? 'Editar Paciente' : 'Novo Paciente'}
              </h2>
              <button
                onClick={() => setModalAberto(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome do paciente"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Data de Nascimento</label>
                <input
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2 rounded-lg text-sm transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg text-sm transition"
                >
                  {salvando ? 'Salvando...' : 'Salvar Paciente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}