import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

interface Ticket {
  id: string;
  subject: string;
  content: string;
  status: string;
  priority: string;
  createdDate: string;
  lastModified: string;
}

type FilterType = 'todos' | 'alta' | 'aberto';

const priorityLabel: Record<string, string> = {
  HIGH: 'Alta',
  MEDIUM: 'Média',
  LOW: 'Baixa',
};

const priorityStyle: Record<string, string> = {
  HIGH: 'bg-red-50 text-red-700',
  MEDIUM: 'bg-amber-50 text-amber-700',
  LOW: 'bg-green-50 text-green-700',
};

const statusLabel: Record<string, string> = {
  '1': 'Em aberto',
  '2': 'Em andamento',
  '3': 'Resolvido',
  '4': 'Fechado',
};

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getInitials(email: string) {
  return email?.slice(0, 2).toUpperCase() || 'ME';
}

export default function Tickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>('todos');
  const email = localStorage.getItem('email') || '';

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
      return;
    }
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/api/tickets');
      setTickets(response.data.tickets);
    } catch (err: any) {
      setError(err.response?.data || 'Erro ao carregar tickets.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/');
  };

  const filtered = tickets.filter((t) => {
    if (filter === 'alta') return t.priority === 'HIGH';
    if (filter === 'aberto') return t.status === '1';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 px-6 h-13 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#1a1a2e] rounded-lg flex items-center justify-center">
            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-800">Meus Tickets</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-xs font-medium text-purple-700">
            {getInitials(email)}
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">{email}</span>
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-3xl mx-auto px-4 py-6">

        {/* Filtros */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-400">
            {filtered.length} ticket{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </span>
          <div className="flex gap-1.5">
            {(['todos', 'alta', 'aberto'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  filter === f
                    ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {f === 'todos' ? 'Todos' : f === 'alta' ? 'Alta prioridade' : 'Em aberto'}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-sm text-gray-400 py-20">
            Carregando tickets...
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Vazio */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center text-sm text-gray-300 py-20">
            Nenhum ticket encontrado.
          </div>
        )}

        {/* Cards */}
        {!loading && filtered.map((ticket, index) => (
          <div
            key={ticket.id}
            className={`bg-white rounded-2xl border border-gray-100 p-5 mb-3 ${
              index === 0 ? 'border-l-2 border-l-purple-500 rounded-l-none' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-sm font-medium text-gray-800">
                {ticket.subject || 'Sem título'}
              </h2>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ml-3 shrink-0 ${
                priorityStyle[ticket.priority] || 'bg-gray-100 text-gray-500'
              }`}>
                {priorityLabel[ticket.priority] || ticket.priority || '—'}
              </span>
            </div>

            {ticket.content && (
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                {ticket.content}
              </p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="text-xs text-gray-400">
                <span className="text-gray-500 font-medium">Status: </span>
                {statusLabel[ticket.status] || ticket.status || '—'}
              </span>
              <span className="text-xs text-gray-400">
                <span className="text-gray-500 font-medium">Criado: </span>
                {formatDate(ticket.createdDate)}
              </span>
              <span className="text-xs text-gray-400">
                <span className="text-gray-500 font-medium">Atualizado: </span>
                {formatDate(ticket.lastModified)}
              </span>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}