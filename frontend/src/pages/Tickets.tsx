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

interface PaginationData {
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

type FilterType = 'todos' | 'alta' | 'media' | 'baixa' | 'aberto' | 'resolvidos';

const priorityLabel: Record<string, string> = {
  HIGH: 'Alta',
  MEDIUM: 'Média',
  LOW: 'Baixa',
};

const priorityStyle: Record<string, string> = {
  HIGH: 'bg-red-500/10 text-red-600 border-red-200',
  MEDIUM: 'bg-amber-500/10 text-amber-600 border-amber-200',
  LOW: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
};

const statusLabel: Record<string, string> = {
  '1': '📋 Em aberto',
  '2': '🔄 Em andamento',
  '3': '✅ Resolvido',
  '4': '🔒 Fechado',
};

const statusColor: Record<string, string> = {
  '1': 'bg-blue-50 border-blue-200 text-blue-700',
  '2': 'bg-purple-50 border-purple-200 text-purple-700',
  '3': 'bg-green-50 border-green-200 text-green-700',
  '4': 'bg-gray-50 border-gray-200 text-gray-600',
};

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getInitials(email: string) {
  return email?.slice(0, 2).toUpperCase() || 'ME';
}

// Componente de Paginação
function Pagination({ currentPage, totalPages, totalItems, hasPrev, hasNext, onPageChange }: { 
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  
  // Gerar array de páginas para exibir
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      if (currentPage < 3) {
        for (let i = 0; i < 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages - 1);
      } else if (currentPage > totalPages - 4) {
        pages.push(0);
        pages.push('...');
        for (let i = totalPages - 4; i < totalPages; i++) pages.push(i);
      } else {
        pages.push(0);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages - 1);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-200">
      <div className="text-sm text-slate-700">
        Mostrando <span className="font-medium text-slate-700">{currentPage * 10 + 1}</span> a{' '}
        <span className="font-medium text-slate-700">
          {Math.min((currentPage + 1) * 10, totalItems)}
        </span>{' '}
        de <span className="font-medium text-slate-700">{totalItems}</span> tickets
      </div>
      
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-1 ${
            hasPrev 
              ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              : 'bg-slate-50 border border-slate-100 text-slate-600 cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>
        
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => (
            typeof page === 'number' ? (
              <button
                key={idx}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 text-sm font-medium rounded-lg transition-all ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page + 1}
              </button>
            ) : (
              <span key={idx} className="w-8 h-8 text-center text-slate-400">
                {page}
              </span>
            )
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-1 ${
            hasNext 
              ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              : 'bg-slate-50 border border-slate-100 text-slate-300 cursor-not-allowed'
          }`}
        >
          Próximo
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Tickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const email = localStorage.getItem('email') || '';
  
  // Paginação states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [paginationEnabled, setPaginationEnabled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchTickets(0);
  }, []);

  const fetchTickets = async (page: number = 0) => {
    try {
      setLoading(true);
      // Tenta usar paginação do backend
      const response = await api.get(`/api/tickets?page=${page}&size=10`);
      
      if (response.data.tickets) {
        setTickets(response.data.tickets);
        setTotalPages(response.data.totalPages || 0);
        setTotalTickets(response.data.total || 0);
        setHasNext(response.data.hasNext || false);
        setHasPrev(response.data.hasPrev || false);
        setCurrentPage(response.data.page || 0);
        setPaginationEnabled(true);
      }
    } catch (err: any) {
      // Se paginação não existir no backend, busca tudo e faz frontend pagination
      try {
        const fallbackResponse = await api.get('/api/tickets');
        setTickets(fallbackResponse.data.tickets || []);
        setTotalTickets(fallbackResponse.data.tickets?.length || 0);
        setTotalPages(Math.ceil((fallbackResponse.data.tickets?.length || 0) / 10));
        setPaginationEnabled(false);
      } catch (fallbackErr: any) {
        setError(fallbackErr.response?.data || 'Erro ao carregar tickets.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/');
  };

  // Filtros (aplicado nos tickets carregados)
  const filteredTickets = tickets.filter((t) => {
    switch (filter) {
      case 'alta':
        return t.priority === 'HIGH';
      case 'media':
        return t.priority === 'MEDIUM';
      case 'baixa':
        return t.priority === 'LOW';
      case 'aberto':
        return t.status === '1';
      case 'resolvidos':
        return t.status === '3' || t.status === '4';
      default:
        return true;
    }
  }).filter((t) => 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.content && t.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginação frontend (se backend não suportar)
  const paginatedTickets = paginationEnabled 
    ? filteredTickets 
    : filteredTickets.slice(currentPage * 10, (currentPage + 1) * 10);

  const stats = {
    total: tickets.length,
    abertos: tickets.filter(t => t.status === '1').length,
    alta: tickets.filter(t => t.priority === 'HIGH').length,
    media: tickets.filter(t => t.priority === 'MEDIUM').length,
    baixa: tickets.filter(t => t.priority === 'LOW').length,
    resolvidos: tickets.filter(t => t.status === '3' || t.status === '4').length,
  };

  const handlePageChange = (newPage: number) => {
    if (paginationEnabled) {
      fetchTickets(newPage);
    } else {
      setCurrentPage(newPage);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-zinc-400 from-slate-50 via-white to-slate-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Meus Tickets</h1>
                <p className="text-xs text-slate-400">Gerencie suas solicitações</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-slate-500">{stats.abertos} abertos</span>
                </div>
                <div className="w-px h-4 bg-slate-200"></div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-slate-500">{stats.alta} alta</span>
                </div>
                <div className="w-px h-4 bg-slate-200"></div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-slate-500">{stats.media} média</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                  {getInitials(email)}
                </div>
                <span className="text-sm text-slate-600 hidden sm:block">{email}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Stats cards estilo Trello */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                <p className="text-xs text-slate-400">Total</p>
              </div>
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.abertos}</p>
                <p className="text-xs text-slate-400">Em aberto</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.alta}</p>
                <p className="text-xs text-slate-400">Alta</p>
              </div>
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.media}</p>
                <p className="text-xs text-slate-400">Média</p>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-emerald-600">{stats.baixa}</p>
                <p className="text-xs text-slate-400">Baixa</p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.resolvidos}</p>
                <p className="text-xs text-slate-400">Resolvidos</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de busca e filtros */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar tickets por título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('todos')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  filter === 'todos'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('alta')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  filter === 'alta'
                    ? 'bg-red-600 text-white shadow-md shadow-red-200'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🔴 Alta
              </button>
              <button
                onClick={() => setFilter('media')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  filter === 'media'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-200'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🟡 Média
              </button>
              <button
                onClick={() => setFilter('baixa')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  filter === 'baixa'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🟢 Baixa
              </button>
              <button
                onClick={() => setFilter('aberto')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  filter === 'aberto'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                📋 Em aberto
              </button>
              <button
                onClick={() => setFilter('resolvidos')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  filter === 'resolvidos'
                    ? 'bg-green-600 text-white shadow-md shadow-green-200'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                ✅ Resolvidos
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-sm text-slate-400 mt-4">Carregando tickets...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Lista de tickets */}
        {!loading && !error && (
          <>
            <div className="space-y-3">
              {paginatedTickets.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">Nenhum ticket encontrado</p>
                  <p className="text-xs text-slate-300 mt-1">Tente outros filtros ou busca</p>
                </div>
              ) : (
                paginatedTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Header do ticket */}
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <div className={`text-xs font-medium px-2 py-1 rounded-full border ${statusColor[ticket.status] || 'bg-gray-100'}`}>
                            {statusLabel[ticket.status] || ticket.status || '—'}
                          </div>
                          <div className={`text-xs font-medium px-2 py-1 rounded-full border ${priorityStyle[ticket.priority] || 'bg-gray-100 text-gray-600'}`}>
                            {priorityLabel[ticket.priority] || ticket.priority || 'Normal'}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(ticket.createdDate)}
                          </div>
                        </div>
                        
                        {/* Título */}
                        <h3 className="text-base font-semibold text-slate-800 mb-2">
                          {ticket.subject || 'Ticket sem título'}
                        </h3>
                        
                        {/* Descrição */}
                        {ticket.content && (
                          <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                            {ticket.content}
                          </p>
                        )}
                        
                        {/* Footer */}
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Ticket #{ticket.id.slice(-6)}
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {formatDate(ticket.lastModified)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Badge de ID */}
                      <div className="hidden sm:block">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                          <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Paginação */}
            {paginatedTickets.length > 0 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalTickets}
                hasPrev={hasPrev}
                hasNext={hasNext}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}