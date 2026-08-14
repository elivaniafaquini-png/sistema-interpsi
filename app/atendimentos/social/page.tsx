'use client';

import { useState } from 'react';

export default function SocialPage() {
  const [paciente, setPaciente] = useState('');
  const [projeto, setProjeto] = useState('Projeto Metanoia');
  const [valorSocial, setValorSocial] = useState('');
  const [lista, setLista] = useState<any[]>([]);
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paciente || !valorSocial) return;

    if (editandoIndex !== null) {
      const novaLista = [...lista];
      novaLista[editandoIndex] = { paciente, projeto, valorSocial };
      setLista(novaLista);
      setEditandoIndex(null);
    } else {
      setLista([...lista, { paciente, projeto, valorSocial }]);
    }

    setPaciente('');
    setValorSocial('');
    setProjeto('Projeto Metanoia');
  };

  const handleEditar = (index: number) => {
    setPaciente(lista[index].paciente);
    setProjeto(lista[index].projeto);
    setValorSocial(lista[index].valorSocial);
    setEditandoIndex(index);
  };

  const handleExcluir = (index: number) => {
    setLista(lista.filter((_, i) => i !== index));
    if (editandoIndex === index) {
      setEditandoIndex(null);
      setPaciente('');
      setValorSocial('');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Atendimento Social
          </h1>
          <p className="text-sm text-cyan-400 font-medium">
            Acompanhamento de projetos e valores acessíveis
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white">
            {editandoIndex !== null ? 'Editar Atendimento Social' : 'Novo Atendimento Social'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Nome do Paciente:</label>
              <input 
                type="text" 
                value={paciente} 
                onChange={(e) => setPaciente(e.target.value)} 
                placeholder="Nome completo..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Projeto Vinculado:</label>
              <input 
                type="text" 
                value={projeto} 
                onChange={(e) => setProjeto(e.target.value)} 
                placeholder="Ex: Projeto Metanoia" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Valor Social Acordado (R$):</label>
            <input 
              type="text" 
              value={valorSocial} 
              onChange={(e) => setValorSocial(e.target.value)} 
              placeholder="Ex: 50,00 ou Social" 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500" 
            />
          </div>

          <button 
            type="submit" 
            className={`font-medium px-5 py-2.5 rounded-lg text-sm transition text-white ${
              editandoIndex !== null ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-cyan-600 hover:bg-cyan-500'
            }`}
          >
            {editandoIndex !== null ? 'Salvar Alterações' : 'Salvar Atendimento Social'}
          </button>
        </form>

        {/* Lista */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white">Pacientes em Atendimento Social</h2>
          
          {lista.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhum registro social cadastrado ainda.</p>
          ) : (
            <ul className="divide-y divide-slate-800">
              {lista.map((item, index) => (
                <li key={index} className="py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-sm">
                  <span className="text-slate-300">
                    <strong className="text-white">{item.paciente}</strong> — Projeto: {item.projeto} <span className="text-cyan-400">(Valor: R$ {item.valorSocial})</span>
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditar(index)} 
                      className="bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleExcluir(index)} 
                      className="bg-slate-800 hover:bg-slate-700 text-red-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition"
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}