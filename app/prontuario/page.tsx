'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Paciente {
  id: string;
  nome: string;
}

interface Evolucao {
  id: string;
  paciente_id: string;
  data: string;
  titulo: string;
  texto: string;
  relato?: string;
  profissional_nome?: string;
}

export default function ProntuarioPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<string>('');
  const [evolucoes, setEvolucoes] = useState<Evolucao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [salvando, setSalvando] = useState<boolean>(false);

  // Modais
  const [modalNova, setModalNova] = useState<boolean>(false);
  const [modalDetalhes, setModalDetalhes] = useState<Evolucao | null>(null);
  const [modalEdicao, setModalEdicao] = useState<Evolucao | null>(null);

  // Form State
  const [dataSessao, setDataSessao] = useState(new Date().toISOString().split('T')[0]);
  const [titulo, setTitulo] = useState('Evolução de Rotina');
  const [texto, setTexto] = useState('');

  // Carregar Pacientes
  useEffect(() => {
    async function carregarPacientes() {
      const { data, error } = await supabase
        .from('pacientes')
        .select('id, nome')
        .order('nome', { ascending: true });

      if (!error && data && data.length > 0) {
        setPacientes(data);
        setPacienteSelecionado(data[0].id);
      }
      setLoading(false);
    }
    carregarPacientes();
  }, []);

  // Carregar Evoluções
  const carregarEvolucoes = async (pacienteId: string) => {
    if (!pacienteId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('evolucoes')
      .select('*')
      .eq('paciente_id', pacienteId)
      .order('data', { ascending: false });

    if (!error && data) {
      setEvolucoes(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (pacienteSelecionado) {
      carregarEvolucoes(pacienteSelecionado);
    }
  }, [pacienteSelecionado]);

  // Salvar Nova
  const handleSalvarNova = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteSelecionado || !texto.trim()) {
      alert('Por favor, preencha o texto do relato.');
      return;
    }

    setSalvando(true);
    const { error } = await supabase.from('evolucoes').insert([
      {
        paciente_id: pacienteSelecionado,
        data: dataSessao,
        titulo: titulo || 'Evolução de Rotina',
        texto: texto,
        relato: texto,
        profissional_nome: 'Psicólogo Responsável',
      },
    ]);

    setSalvando(false);

    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      alert('Evolução salva com sucesso!');
      setTexto('');
      setModalNova(false);
      carregarEvolucoes(pacienteSelecionado);
    }
  };

  // Salvar Edição
  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalEdicao) return;

    setSalvando(true);
    const { error } = await supabase
      .from('evolucoes')
      .update({
        data: modalEdicao.data,
        titulo: modalEdicao.titulo,
        texto: modalEdicao.texto,
        relato: modalEdicao.texto,
      })
      .eq('id', modalEdicao.id);

    setSalvando(false);

    if (error) {
      alert('Erro ao atualizar: ' + error.message);
    } else {
      alert('Evolução atualizada com sucesso!');
      setModalEdicao(null);
      carregarEvolucoes(pacienteSelecionado);
    }
  };

  // Excluir
  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta evolução?')) return;

    const { error } = await supabase.from('evolucoes').delete().eq('id', id);

    if (error) {
      alert('Erro ao excluir no banco de dados: ' + error.message);
    } else {
      // Remove instantaneamente da tela atualizando o estado local
      setEvolucoes((prev) => prev.filter((evo) => evo.id !== id));
      alert('Evolução excluída com sucesso!');
    }
  };

  const pacienteAtual = pacientes.find((p) => p.id === pacienteSelecionado);

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-800 p-6 rounded-xl border border-slate-700 gap-4">
          <div>
            <Link href="/" className="text-sm text-cyan-400 hover:underline mb-2 inline-block">
              ← Voltar ao Início
            </Link>
            <h1 className="text-2xl font-bold">Prontuário & Evoluções (Sigilo Protegido 🔒)</h1>
            <p className="text-slate-400 text-sm">Registros técnicos dos atendimentos</p>
          </div>
          <button
            onClick={() => {
              setDataSessao(new Date().toISOString().split('T')[0]);
              setTitulo('Evolução de Rotina');
              setTexto('');
              setModalNova(true);
            }}
            disabled={!pacienteSelecionado}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium px-4 py-2.5 rounded-lg transition"
          >
            + Nova Evolução
          </button>
        </div>

        {/* Seletor de Paciente */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <label className="text-sm text-slate-300 font-medium">Selecione o Paciente:</label>
          <select
            value={pacienteSelecionado}
            onChange={(e) => setPacienteSelecionado(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500 w-full md:w-80"
          >
            {pacientes.length === 0 ? (
              <option value="">Nenhum paciente cadastrado</option>
            ) : (
              pacientes.map((pac) => (
                <option key={pac.id} value={pac.id}>
                  👤 {pac.nome}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Lista de Evoluções */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-200">
            Histórico: <span className="text-purple-400">{pacienteAtual?.nome || 'Selecione um paciente'}</span>
          </h2>

          {loading ? (
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center text-slate-400">
              Carregando histórico...
            </div>
          ) : evolucoes.length === 0 ? (
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center text-slate-400">
              Nenhuma evolução registrada para este paciente.
            </div>
          ) : (
            evolucoes.map((evo) => (
              <div key={evo.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-700 pb-3 gap-2">
                  <div>
                    <h3 className="font-bold text-lg text-purple-300">{evo.titulo}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      📅 Data: {evo.data} | Por: {evo.profissional_nome || 'Psicólogo Responsável'}
                    </p>
                  </div>

                  {/* Botões Ação */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setModalDetalhes(evo)}
                      className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-md border border-slate-600"
                    >
                      👁️ Ver Detalhes
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalEdicao(evo)}
                      className="text-xs bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 px-3 py-1.5 rounded-md border border-indigo-700"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExcluir(evo.id)}
                      className="text-xs bg-red-900/60 hover:bg-red-800 text-red-200 px-3 py-1.5 rounded-md border border-red-700"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>

                <p className="text-slate-300 text-sm line-clamp-2 bg-slate-900/60 p-3 rounded-lg font-mono">
                  {evo.texto || evo.relato}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Modal: Nova Evolução */}
        {modalNova && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
              <h2 className="text-xl font-bold text-slate-100">Registrar Evolução do Paciente</h2>

              <form onSubmit={handleSalvarNova} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Data da Sessão *</label>
                    <input
                      type="date"
                      value={dataSessao}
                      onChange={(e) => setDataSessao(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-purple-500 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Título / Assunto</label>
                    <input
                      type="text"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Ex: Sessão de Análise..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-purple-500 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Relato Terapêutico *</label>
                  <textarea
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    rows={6}
                    placeholder="Descreva as observações técnicas e evolução clínica..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-purple-500 text-white"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalNova(false)}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvando}
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
                  >
                    {salvando ? 'Salvando...' : 'Salvar Prontuário'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Ver Detalhes */}
        {modalDetalhes && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-2xl space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                <h2 className="text-xl font-bold text-purple-300">{modalDetalhes.titulo}</h2>
                <span className="text-xs text-slate-400">📅 {modalDetalhes.data}</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-lg max-h-96 overflow-y-auto">
                <p className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
                  {modalDetalhes.texto || modalDetalhes.relato}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalDetalhes(null)}
                  className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-4 py-2 rounded-lg"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Editar */}
        {modalEdicao && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
              <h2 className="text-xl font-bold text-slate-100">Editar Evolução</h2>

              <form onSubmit={handleSalvarEdicao} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Data *</label>
                    <input
                      type="date"
                      value={modalEdicao.data}
                      onChange={(e) => setModalEdicao({ ...modalEdicao, data: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Título</label>
                    <input
                      type="text"
                      value={modalEdicao.titulo}
                      onChange={(e) => setModalEdicao({ ...modalEdicao, titulo: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Relato Terapêutico *</label>
                  <textarea
                    value={modalEdicao.texto || modalEdicao.relato || ''}
                    onChange={(e) => setModalEdicao({ ...modalEdicao, texto: e.target.value })}
                    rows={6}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalEdicao(null)}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvando}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
                  >
                    {salvando ? 'Salvando...' : 'Salvar Alterações'}
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