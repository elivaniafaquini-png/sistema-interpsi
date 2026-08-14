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

interface Documento {
  id: string;
  titulo: string;
  tipo: string;
  created_at: string;
}

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDocumentos();
  }, []);

  async function carregarDocumentos() {
    setCarregando(true);
    const { data } = await supabase.from('documentos').select('*').order('titulo', { ascending: true });
    if (data) setDocumentos(data);
    setCarregando(false);
  }

  async function handleExcluir(id: string, titulo: string) {
    if (confirm(`Tem certeza que deseja excluir "${titulo}"?`)) {
      const { error } = await supabase.from('documentos').delete().eq('id', id);
      if (error) {
        alert('Erro ao excluir: ' + error.message);
      } else {
        carregarDocumentos();
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
            <h1 className="text-2xl font-bold mt-1">Gestão de Documentos</h1>
            <p className="text-slate-400 text-sm">Arquivos e modelos da clínica</p>
          </div>
        </div>

        {/* Tabela de Documentos */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase bg-slate-950/50">
                  <th className="p-4">Título do Documento</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {carregando ? (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-400">Carregando documentos...</td>
                  </tr>
                ) : documentos.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-400">Nenhum documento cadastrado.</td>
                  </tr>
                ) : (
                  documentos.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-800/50 transition">
                      <td className="p-4 font-medium text-white">{d.titulo}</td>
                      <td className="p-4 text-slate-300">{d.tipo || 'Geral'}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleExcluir(d.id, d.titulo)}
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
    </main>
  );
}