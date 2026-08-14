'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function ProfissionaisPage() {
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [formData, setFormData] = useState({ 
    nome: '', 
    crp: '', 
    especialidade_abordagem: '', 
    email: '', 
    telefone: '' 
  });
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => { carregarProfissionais(); }, []);

  async function carregarProfissionais() {
    setLoading(true);
    const { data } = await supabase.from('profissionais').select('*').order('nome');
    if (data) setProfissionais(data);
    setLoading(false);
  }

  function prepararEdicao(p: any) {
    setEditandoId(p.id);
    setFormData({ 
      nome: p.nome || '', 
      crp: p.crp || '', 
      especialidade_abordagem: p.especialidade_abordagem || '', 
      email: p.email || '', 
      telefone: p.telefone || '' 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setFormData({ nome: '', crp: '', especialidade_abordagem: '', email: '', telefone: '' });
  }

  async function handleExcluir(id: string) {
    if (confirm('Tem certeza que deseja excluir este profissional?')) {
      const { error } = await supabase.from('profissionais').delete().eq('id', id);
      if (error) {
        alert('Erro ao excluir: ' + error.message);
      } else {
        if (editandoId === id) cancelarEdicao();
        carregarProfissionais();
      }
    }
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    if (editandoId) {
      const { error } = await supabase.from('profissionais').update(formData).eq('id', editandoId);
      if (error) {
        alert('Erro ao atualizar: ' + error.message);
      } else {
        alert('Profissional atualizado com sucesso!');
        cancelarEdicao();
        carregarProfissionais();
      }
    } else {
      const { error } = await supabase.from('profissionais').insert([formData]);
      if (error) {
        alert('Erro ao cadastrar: ' + error.message);
      } else {
        alert('Profissional cadastrado com sucesso!');
        setFormData({ nome: '', crp: '', especialidade_abordagem: '', email: '', telefone: '' });
        carregarProfissionais();
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Profissionais</h1>
          <p className="text-slate-400">Cadastro e acompanhamento da equipe clínica.</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSalvar} className="bg-slate-900 p-6 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-sm font-semibold text-cyan-400">
              {editandoId ? 'Editando Profissional Selecionado' : 'Novo Cadastro'}
            </span>
            {editandoId && (
              <button 
                type="button" 
                onClick={cancelarEdicao} 
                className="text-xs text-amber-400 hover:underline"
              >
                Cancelar Edição
              </button>
            )}
          </div>

          <input placeholder="Nome Completo *" className="bg-slate-950 border border-slate-800 p-3 rounded text-white" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
          <input placeholder="CRP" className="bg-slate-950 border border-slate-800 p-3 rounded text-white" value={formData.crp} onChange={e => setFormData({...formData, crp: e.target.value})} />
          <input placeholder="Especialidade / Abordagem" className="bg-slate-950 border border-slate-800 p-3 rounded text-white md:col-span-2" value={formData.especialidade_abordagem} onChange={e => setFormData({...formData, especialidade_abordagem: e.target.value})} />
          <input placeholder="E-mail" className="bg-slate-950 border border-slate-800 p-3 rounded text-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input placeholder="Telefone" className="bg-slate-950 border border-slate-800 p-3 rounded text-white" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} />
          
          <button type="submit" className={`p-3 rounded font-bold md:col-span-2 text-white transition ${editandoId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
            {editandoId ? 'Salvar Alterações' : 'Cadastrar Profissional'}
          </button>
        </form>

        {/* Tabela com rolagem horizontal garantida */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="p-4 text-left">Nome</th>
                <th className="p-4 text-left">CRP</th>
                <th className="p-4 text-left">Abordagem</th>
                <th className="p-4 text-left">Contato</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {profissionais.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">Nenhum profissional cadastrado.</td>
                </tr>
              ) : (
                profissionais.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-bold">{p.nome}</td>
                    <td className="p-4">{p.crp || '-'}</td>
                    <td className="p-4 text-slate-400">{p.especialidade_abordagem || '-'}</td>
                    <td className="p-4 text-xs">
                      <div>{p.email}</div>
                      <div>{p.telefone}</div>
                    </td>
                    <td className="p-4 text-center space-x-3">
                      <button type="button" onClick={() => prepararEdicao(p)} className="text-cyan-400 hover:underline font-medium">Editar</button>
                      <button type="button" onClick={() => handleExcluir(p.id)} className="text-red-400 hover:underline font-medium">Excluir</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}