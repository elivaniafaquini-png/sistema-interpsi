'use client'

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
}

interface Profissional {
  id: string;
  nome: string;
  crp: string;
}

interface Documento {
  id: string;
  tipo: string;
  data_emissao: string;
  pacientes: { nome: string };
}

export default function DocumentosPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [historico, setHistorico] = useState<Documento[]>([]);
  
  const [pacienteId, setPacienteId] = useState('');
  const [profissionalId, setProfissionalId] = useState('');
  const [tipo, setTipo] = useState('Atestado Psicológico');
  const [conteudo, setConteudo] = useState('');
  const [dataEmissao, setDataEmissao] = useState(new Date().toISOString().split('T')[0]);
  const [salvando, setSalvando] = useState(false);
  const [mostrarVisualizacao, setMostrarVisualizacao] = useState(false);

  async function carregarDados() {
    const { data: pacData } = await supabase.from('pacientes').select('id, nome').order('nome');
    if (pacData && pacData.length > 0) {
      setPacientes(pacData);
      setPacienteId(pacData[0].id);
    }

    const { data: profData } = await supabase.from('profissionais').select('id, nome, crp').order('nome');
    if (profData && profData.length > 0) {
      setProfissionais(profData);
      const meuPerfil = profData.find(p => p.crp?.includes('23/3260') || p.nome.toLowerCase().includes('elivania'));
      setProfissionalId(meuPerfil ? meuPerfil.id : profData[0].id);
    }

    const { data: docData } = await supabase.from('documentos').select('id, tipo, data_emissao, pacientes(nome)');
    if (docData) {
      setHistorico(docData as any);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function gerarModelo(tipoDoc: string, nomePaciente: string) {
    if (tipoDoc.toLowerCase().includes('atestado')) {
      return `Atestamos para os devidos fins que o(a) Sr.(a) ${nomePaciente}, esteve sob nossos cuidados profissionais de atendimento psicológico nesta data, das __:__ às __:__, sendo necessária sua ausência das atividades laborais/escolares.`;
    } else {
      return `Declaro para os devidos fins que o(a) Sr.(a) ${nomePaciente}, está em acompanhamento psicológico regular nesta instituição.`;
    }
  }

  const pacienteAtual = pacientes.find(p => p.id === pacienteId);
  const profissionalAtual = profissionais.find(p => p.id === profissionalId);

  useEffect(() => {
    if (pacienteAtual) {
      setConteudo(gerarModelo(tipo, pacienteAtual.nome));
    }
  }, [tipo, pacienteId]);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    const { error } = await supabase.from('documentos').insert([
      {
        paciente_id: pacienteId,
        profissional_id: profissionalId,
        tipo,
        conteudo,
        data_emissao: dataEmissao
      }
    ]);
    setSalvando(false);

    if (error) {
      alert('Erro ao salvar documento: ' + error.message);
    } else {
      alert('Documento gerado e salvo com sucesso!');
      carregarDados();
    }
  }

  async function handleExcluir(id: string) {
    if (confirm('Tem certeza que deseja excluir este documento do histórico?')) {
      const { error } = await supabase.from('documentos').delete().eq('id', id);
      if (error) {
        alert('Erro ao excluir: ' + error.message);
      } else {
        carregarDados();
      }
    }
  }

  function handleImprimir() {
    window.print();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .print-sheet, .print-sheet * {
            visibility: visible !important;
          }
          .print-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="no-print flex justify-between items-center bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div>
            <Link href="/" className="text-sm text-cyan-400 hover:underline mb-2 inline-block">
              ← Voltar ao Início
            </Link>
            <h1 className="text-2xl font-bold">Emissão de Documentos & Atestados</h1>
          </div>
          {mostrarVisualizacao && (
            <button
              onClick={handleImprimir}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm transition font-medium"
            >
              🖨️ Imprimir / Salvar PDF
            </button>
          )}
        </div>

        {/* Formulário de Configuração */}
        <div className="no-print bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-semibold border-b border-slate-800 pb-2">Configurar Documento</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Paciente *</label>
              <select
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white"
              >
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Profissional Responsável *</label>
              <select
                value={profissionalId}
                onChange={(e) => setProfissionalId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white"
              >
                {profissionais.map((prof) => (
                  <option key={prof.id} value={prof.id}>{prof.nome} (CRP: {prof.crp || 'Não informado'})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Tipo de Documento (Digite livremente) *</label>
              <input
                type="text"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                placeholder="Ex: Atestado Psicológico, Laudo, Declaração..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Data de Emissão *</label>
              <input
                type="date"
                value={dataEmissao}
                onChange={(e) => setDataEmissao(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Conteúdo do Documento (Editável)</label>
            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              rows={5}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white font-sans leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setMostrarVisualizacao(!mostrarVisualizacao)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-5 py-2.5 rounded-lg text-sm transition"
            >
              {mostrarVisualizacao ? 'Ocultar Visualização' : '👁️ Visualizar Documento'}
            </button>
            <button
              onClick={handleSalvar}
              disabled={salvando}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition"
            >
              {salvando ? 'Salvando...' : 'Salvar no Histórico'}
            </button>
          </div>
        </div>

        {/* Visualização da Folha */}
        {mostrarVisualizacao && (
          <div className="print-sheet bg-white text-slate-900 p-10 rounded-xl shadow-xl space-y-10 min-h-[420px] flex flex-col justify-between border border-slate-800 animate-fade-in">
            <div className="space-y-6">
              <div className="text-center border-b border-slate-200 pb-6">
                <h2 className="text-xl font-bold uppercase tracking-wide text-slate-800">Instituto InterPsi</h2>
                <p className="text-xs text-slate-500 mt-1">Psicologia Clínica e Comportamental</p>
                <h3 className="text-lg font-bold text-slate-900 mt-4">{tipo}</h3>
              </div>

              <div className="text-justify text-base leading-relaxed pt-2 text-slate-800">
                {conteudo}
              </div>
            </div>

            <div className="pt-12 text-center space-y-2">
              <div className="w-64 mx-auto border-t border-slate-400 pt-1">
                <p className="text-sm font-semibold text-slate-800">
                  {profissionalAtual ? profissionalAtual.nome : 'Elivania de Carvalho Lopes Faquini'}
                </p>
                <p className="text-xs text-slate-500">
                  Psicóloga - CRP {profissionalAtual?.crp ? profissionalAtual.crp : '23/3260'}
                </p>
              </div>
              <p className="text-xs text-slate-400 pt-3">
                Documento emitido em {new Date(dataEmissao + 'T00:00:00').toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        )}

        {/* Histórico de Documentos Emitidos */}
        <div className="no-print bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-semibold">Histórico de Documentos Emitidos</h2>
          {historico.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhum documento emitido até o momento.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs uppercase bg-slate-800 text-slate-200">
                  <tr>
                    <th className="px-4 py-3">Paciente</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {historico.map((doc) => (
                    <tr key={doc.id} className="border-b border-slate-800 hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-medium text-white">{doc.pacientes?.nome || 'Paciente não encontrado'}</td>
                      <td className="px-4 py-3">{doc.tipo}</td>
                      <td className="px-4 py-3">{new Date(doc.data_emissao + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-3 text-right space-x-3">
                        <button 
                          onClick={() => {
                            setTipo(doc.tipo);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }} 
                          className="text-cyan-400 hover:underline font-medium text-xs"
                        >
                          Carregar
                        </button>
                        <button 
                          onClick={() => handleExcluir(doc.id)} 
                          className="text-red-400 hover:underline font-medium text-xs"
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

      </div>
    </main>
  );
}