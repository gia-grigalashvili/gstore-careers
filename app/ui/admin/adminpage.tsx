/* eslint-disable react-hooks/immutability */
'use client'

import { useEffect, useState } from 'react'
import { getApplications, getVacancies, updateApplicationStatus, deleteApplication, getStatistics, Vacancy, ApplicationWithVacancy } from '@/actions/admin'

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationWithVacancy[]>([])
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [filteredApps, setFilteredApps] = useState<ApplicationWithVacancy[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, today: 0, statusCounts: {} })
  
  const [filters, setFilters] = useState({
    vacancy: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  })
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'date-asc' | 'date-desc'>('date-desc')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [applications, filters, sortBy])

  const loadData = async () => {
    const [appsResult, vacResult, statsResult] = await Promise.all([
      getApplications(),
      getVacancies(false),
      getStatistics()
    ])

    if (appsResult.data) setApplications(appsResult.data)
    if (vacResult.data) setVacancies(vacResult.data)
    if (statsResult) setStats(statsResult)
    
    setLoading(false)
  }

  const applyFiltersAndSort = () => {
    let filtered = [...applications]

    if (filters.vacancy !== 'all') {
      filtered = filtered.filter(app => app.vacancy_id === filters.vacancy)
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(app => app.status === filters.status)
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(app => 
        new Date(app.created_at) >= new Date(filters.dateFrom)
      )
    }

    if (filters.dateTo) {
      filtered = filtered.filter(app => 
        new Date(app.created_at) <= new Date(filters.dateTo + 'T23:59:59')
      )
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower) ||
        app.phone.includes(searchLower)
      )
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name, 'ka')
        case 'name-desc':
          return b.name.localeCompare(a.name, 'ka')
        case 'date-asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'date-desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    setFilteredApps(filtered)
  }

  const handleStatusChange = async (id: string, status: any) => {
    await updateApplicationStatus(id, status)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (confirm('დარწმუნებული ხარ, რომ გსურს წაშლა?')) {
      await deleteApplication(id)
      loadData()
    }
  }

  const resetFilters = () => {
    setFilters({
      vacancy: 'all',
      status: 'all',
      dateFrom: '',
      dateTo: '',
      search: ''
    })
    setSortBy('date-desc')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ka-GE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
      reviewed: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
      accepted: 'bg-green-500/10 text-green-500 border-green-500/30',
      rejected: 'bg-red-500/10 text-red-500 border-red-500/30'
    }
    const labels = {
      pending: 'მოლოდინში',
      reviewed: 'განხილული',
      accepted: 'მიღებული',
      rejected: 'უარყოფილი'
    }
    return { style: styles[status as keyof typeof styles], label: labels[status as keyof typeof labels] }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C1220] flex items-center justify-center">
        <div className="text-white text-xl">იტვირთება...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0C1220]">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#1a1f2e]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#3A6FF8] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">G</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                <p className="text-sm text-[#DDE2E9]">განაცხადების მართვა</p>
              </div>
            </div>
            <a
              href="/"
              className="flex items-center gap-2 text-[#3A6FF8] hover:text-[#2557e0] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>მთავარ გვერდზე</span>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1a1f2e] border border-gray-800 rounded-xl p-6">
            <h3 className="text-[#DDE2E9] text-sm font-semibold mb-2">სულ განაცხადი</h3>
            <p className="text-4xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-[#1a1f2e] border border-gray-800 rounded-xl p-6">
            <h3 className="text-[#DDE2E9] text-sm font-semibold mb-2">დღეს მიღებული</h3>
            <p className="text-4xl font-bold text-[#3A6FF8]">{stats.today}</p>
          </div>
          <div className="bg-[#1a1f2e] border border-gray-800 rounded-xl p-6">
            <h3 className="text-[#DDE2E9] text-sm font-semibold mb-2">მოლოდინში</h3>
            <p className="text-4xl font-bold text-yellow-500">{stats.statusCounts.pending || 0}</p>
          </div>
          <div className="bg-[#1a1f2e] border border-gray-800 rounded-xl p-6">
            <h3 className="text-[#DDE2E9] text-sm font-semibold mb-2">გაფილტრული</h3>
            <p className="text-4xl font-bold text-[#F5C96B]">{filteredApps.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1f2e] border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[250px]">
              <label className="block text-white text-sm font-semibold mb-2">ძიება</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="სახელი, ელფოსტა, ტელეფონი..."
                className="w-full bg-[#0C1220] text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#3A6FF8]"
              />
            </div>

            {/* Vacancy Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-white text-sm font-semibold mb-2">ვაკანსია</label>
              <select
                value={filters.vacancy}
                onChange={(e) => setFilters({ ...filters, vacancy: e.target.value })}
                className="w-full md:w-auto bg-[#0C1220] text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#3A6FF8]"
              >
                <option value="all">ყველა</option>
                {vacancies.map(v => (
                  <option key={v.id} value={v.id}>{v.title}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-white text-sm font-semibold mb-2">სტატუსი</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full md:w-auto bg-[#0C1220] text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#3A6FF8]"
              >
                <option value="all">ყველა</option>
                <option value="pending">მოლოდინში</option>
                <option value="reviewed">განხილული</option>
                <option value="accepted">მიღებული</option>
                <option value="rejected">უარყოფილი</option>
              </select>
            </div>

            {/* Date From */}
            <div className="w-full md:w-auto">
              <label className="block text-white text-sm font-semibold mb-2">თარიღიდან</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full md:w-auto bg-[#0C1220] text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#3A6FF8]"
              />
            </div>

            {/* Date To */}
            <div className="w-full md:w-auto">
              <label className="block text-white text-sm font-semibold mb-2">თარიღამდე</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full md:w-auto bg-[#0C1220] text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#3A6FF8]"
              />
            </div>

            {/* Sort */}
            <div className="w-full md:w-auto">
              <label className="block text-white text-sm font-semibold mb-2">დალაგება</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full md:w-auto bg-[#0C1220] text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#3A6FF8]"
              >
                <option value="date-desc">თარიღი (ახალი → ძველი)</option>
                <option value="date-asc">თარიღი (ძველი → ახალი)</option>
                <option value="name-asc">სახელი (ა → ჰ)</option>
                <option value="name-desc">სახელი (ჰ → ა)</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg transition-colors"
              >
                გასუფთავება
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1a1f2e] border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0C1220]">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">სახელი</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">ელფოსტა</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">ტელეფონი</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">ვაკანსია</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">სტატუსი</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">თარიღი</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">რეზიუმე</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">მოქმედება</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-[#DDE2E9]">
                      განაცხადები არ მოიძებნა
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => {
                    const statusBadge = getStatusBadge(app.status)
                    return (
                      <tr
                        key={app.id}
                        className="border-t border-gray-800 hover:bg-[#0C1220] transition-colors"
                      >
                        <td className="px-6 py-4 text-white font-medium">{app.name}</td>
                        <td className="px-6 py-4 text-[#DDE2E9]">{app.email}</td>
                        <td className="px-6 py-4 text-[#DDE2E9]">{app.phone}</td>
                        <td className="px-6 py-4">
                          <span className="inline-block bg-[#3A6FF8]/10 border border-[#3A6FF8]/30 text-[#3A6FF8] px-3 py-1 rounded-full text-sm font-semibold">
                            {app.vacancy?.title || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className={`${statusBadge.style} border px-3 py-1 rounded-full text-sm font-semibold focus:outline-none`}
                          >
                            <option value="pending">მოლოდინში</option>
                            <option value="reviewed">განხილული</option>
                            <option value="accepted">მიღებული</option>
                            <option value="rejected">უარყოფილი</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-[#DDE2E9] text-sm whitespace-nowrap">
                          {formatDate(app.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#F5C96B] hover:text-[#e0b855] transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="font-semibold">ჩამოტვირთვა</span>
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="text-red-500 hover:text-red-400 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}