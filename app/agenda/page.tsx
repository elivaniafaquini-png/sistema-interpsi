'use client';

export default function AgendaPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-xl">
        
        <div className="space-y-2">
          <div className="w-16 h-16 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-3xl">
            📅
          </div>
          <h1 className="text-2xl font-bold text-white pt-2">Google Agenda do Instituto</h1>
          <p className="text-slate-400 text-sm">
            Gerencie seus horários, consultas e compromissos diretamente na interface oficial e limpa do Google Agenda.
          </p>
        </div>

        <div className="pt-4">
          <a
            href="https://calendar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-8 py-3 rounded-xl text-sm transition shadow-lg shadow-emerald-900/20"
          >
            <span>Abrir Google Agenda</span>
            <span className="text-base">↗</span>
          </a>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-500">
            Conta vinculada: iinterpsi@gmail.com
          </p>
        </div>

      </div>
    </div>
  );
}