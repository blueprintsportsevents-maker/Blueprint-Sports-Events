import React, { useState, useMemo } from 'react';
import { useMeet } from '../context/MeetContext';
import { Athlete, Team, Gender, AgeCategory } from '../types/sports';
import {
  Users,
  UserPlus,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Hash,
  Edit2,
  Trash2,
  Plus,
  Download,
  Upload
} from 'lucide-react';

export const AthletesTeamsView: React.FC = () => {
  const {
    teams,
    athletes,
    addTeam,
    updateTeam,
    deleteTeam,
    addAthlete,
    updateAthlete,
    deleteAthlete,
    bulkAssignBibs,
  } = useMeet();

  const [activeSubTab, setActiveSubTab] = useState<'athletes' | 'teams'>('athletes');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('ALL');
  const [filterGender, setFilterGender] = useState('ALL');
  const [filterDistrict, setFilterDistrict] = useState('ALL');

  // Modals state
  const [showAthleteModal, setShowAthleteModal] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  // Athlete form state
  const [athForm, setAthForm] = useState({
    bib: 100,
    firstName: '',
    lastName: '',
    gender: 'Men' as Gender,
    category: 'Senior' as AgeCategory,
    teamId: teams[0]?.id || '',
    district: 'District 1',
    state: 'CA',
    medicalCleared: true,
    waiverSigned: true,
    notes: ''
  });

  // Team form state
  const [teamForm, setTeamForm] = useState({
    name: '',
    shortCode: '',
    color: '#2563eb',
    coach: '',
    city: '',
    stateCountry: '',
    division: 'Division I',
    district: 'District 1'
  });

  const teamMap = useMemo(() => new Map(teams.map(t => [t.id, t])), [teams]);

  // Filtered athletes
  const filteredAthletes = useMemo(() => {
    return athletes.filter(a => {
      const matchesSearch =
        `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.bib.toString().includes(searchTerm);
      const matchesTeam = filterTeam === 'ALL' || a.teamId === filterTeam;
      const matchesGender = filterGender === 'ALL' || a.gender === filterGender;
      const athDistrict = a.district || teamMap.get(a.teamId)?.district || 'District 1';
      const matchesDistrict = filterDistrict === 'ALL' || athDistrict === filterDistrict;
      return matchesSearch && matchesTeam && matchesGender && matchesDistrict;
    });
  }, [athletes, searchTerm, filterTeam, filterGender, filterDistrict, teamMap]);

  const openNewAthleteModal = () => {
    const nextBib = athletes.length > 0 ? Math.max(...athletes.map(a => a.bib)) + 1 : 101;
    const defaultTeam = teams[0];
    const defaultState = defaultTeam?.stateCountry ? defaultTeam.stateCountry.split(',')[0].trim() : 'CA';
    setAthForm({
      bib: nextBib,
      firstName: '',
      lastName: '',
      gender: 'Men',
      category: 'Senior',
      teamId: defaultTeam?.id || '',
      district: defaultTeam?.district || 'District 1',
      state: defaultState,
      medicalCleared: true,
      waiverSigned: true,
      notes: ''
    });
    setEditingAthlete(null);
    setShowAthleteModal(true);
  };

  const openEditAthleteModal = (ath: Athlete) => {
    const tm = teamMap.get(ath.teamId);
    const tmState = tm?.stateCountry ? tm.stateCountry.split(',')[0].trim() : 'CA';
    setAthForm({
      bib: ath.bib,
      firstName: ath.firstName,
      lastName: ath.lastName,
      gender: ath.gender,
      category: ath.category,
      teamId: ath.teamId,
      district: ath.district || tm?.district || 'District 1',
      state: ath.state || tmState,
      medicalCleared: ath.medicalCleared,
      waiverSigned: ath.waiverSigned,
      notes: ath.notes || ''
    });
    setEditingAthlete(ath);
    setShowAthleteModal(true);
  };

  const handleSaveAthlete = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAthlete) {
      updateAthlete(editingAthlete.id, athForm);
    } else {
      addAthlete(athForm);
    }
    setShowAthleteModal(false);
  };

  const openNewTeamModal = () => {
    setTeamForm({
      name: '',
      shortCode: '',
      color: '#2563eb',
      coach: '',
      city: '',
      stateCountry: '',
      division: 'Division I',
      district: 'District 1'
    });
    setEditingTeam(null);
    setShowTeamModal(true);
  };

  const openEditTeamModal = (t: Team) => {
    setTeamForm({
      name: t.name,
      shortCode: t.shortCode,
      color: t.color,
      coach: t.coach,
      city: t.city,
      stateCountry: t.stateCountry,
      division: t.division || 'Division I',
      district: t.district || 'District 1'
    });
    setEditingTeam(t);
    setShowTeamModal(true);
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeam) {
      updateTeam(editingTeam.id, teamForm);
    } else {
      addTeam(teamForm);
    }
    setShowTeamModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs & Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveSubTab('athletes')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeSubTab === 'athletes'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Athletes Roster ({athletes.length})
          </button>
          <button
            onClick={() => setActiveSubTab('teams')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeSubTab === 'teams'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Teams & Clubs ({teams.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'athletes' ? (
            <>
              <button
                onClick={() => bulkAssignBibs(101)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
                title="Renumber bibs sequentially from 101"
              >
                <Hash className="w-3.5 h-3.5 text-amber-400" />
                Auto-Assign Bibs
              </button>
              <button
                onClick={openNewAthleteModal}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                Add Athlete
              </button>
            </>
          ) : (
            <button
              onClick={openNewTeamModal}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add New Team
            </button>
          )}
        </div>
      </div>

      {activeSubTab === 'athletes' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search athlete by name or bib number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Teams</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.shortCode} - {t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="ALL">All Districts</option>
                <option value="District 1">District 1</option>
                <option value="District 2">District 2</option>
                <option value="District 3">District 3</option>
                <option value="District 4">District 4</option>
                <option value="District 5">District 5</option>
                <option value="District 6">District 6</option>
              </select>
            </div>

            <div>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Divisions / Genders</option>
                <option value="Men">Men / Boys</option>
                <option value="Women">Women / Girls</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
          </div>

          {/* Athletes Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-16 text-center">Bib</th>
                    <th className="py-3 px-4">Athlete Name</th>
                    <th className="py-3 px-4">Team / Club</th>
                    <th className="py-3 px-4">Gender / Category</th>
                    <th className="py-3 px-4 text-center font-bold text-blue-400">Districts</th>
                    <th className="py-3 px-4 text-center font-bold text-amber-400">State</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredAthletes.map((ath) => {
                    const team = teamMap.get(ath.teamId);
                    const districtLabel = ath.district || team?.district || 'District 1';
                    const stateLabel = ath.state || (team?.stateCountry ? team.stateCountry.split(',')[0].trim() : 'CA');
                    return (
                      <tr key={ath.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block bg-slate-800 text-amber-400 font-bold px-2 py-0.5 rounded font-mono-timing text-xs border border-slate-700">
                            {ath.bib}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          <div className="flex items-center gap-1.5">
                            <span>{ath.firstName} {ath.lastName}</span>
                            {ath.medicalCleared && ath.waiverSigned ? (
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" title="Clearance: Medically cleared & waiver signed" />
                            ) : (
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse flex-shrink-0" title="Clearance: Pending" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: team?.color || '#3b82f6' }}
                            />
                            <span className="font-semibold text-slate-200">{team?.shortCode}</span>
                            <span className="text-slate-400 text-[11px] truncate hidden md:inline">({team?.name})</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          <span className="px-2 py-0.5 bg-slate-800 rounded text-[11px] font-medium mr-1.5">
                            {ath.gender}
                          </span>
                          <span className="text-slate-400 text-[11px]">{ath.category}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono-timing">
                            {districtLabel}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center justify-center min-w-[34px] px-2 py-0.5 rounded-md text-xs font-black bg-slate-950 text-amber-300 border border-slate-700 font-mono-timing shadow-xs">
                            {stateLabel}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => openEditAthleteModal(ath)}
                            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                            title="Edit Athlete"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove athlete ${ath.firstName} ${ath.lastName}?`)) {
                                deleteAthlete(ath.id);
                              }
                            }}
                            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete Athlete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredAthletes.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-500">
                        No athletes found matching criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Teams SubTab */}
      {activeSubTab === 'teams' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teams.map((team) => {
            const teamAthletes = athletes.filter(a => a.teamId === team.id);
            return (
              <div
                key={team.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: team.color }}
                />

                <div className="space-y-2 mt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-chakra font-black text-lg text-white tracking-wider">
                      {team.shortCode}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded border border-blue-500/20 font-mono-timing">
                        {team.district || 'District 1'}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded">
                        {team.division || 'Club'}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm">{team.name}</h3>
                  <div className="text-xs text-slate-400">
                    <div>Coach: <span className="text-slate-200">{team.coach || 'Head Coach'}</span></div>
                    <div>Location: <span className="text-slate-200">{team.city}, {team.stateCountry}</span></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-400">
                    {teamAthletes.length} Athletes
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditTeamModal(team)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-blue-400 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove team ${team.name}? Athletes will need re-affiliation.`)) {
                          deleteTeam(team.id);
                        }
                      }}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add/Edit Athlete */}
      {showAthleteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-400" />
              {editingAthlete ? 'Edit Athlete Registration' : 'Register New Athlete'}
            </h3>

            <form onSubmit={handleSaveAthlete} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={athForm.firstName}
                    onChange={(e) => setAthForm({ ...athForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={athForm.lastName}
                    onChange={(e) => setAthForm({ ...athForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bib Number</label>
                  <input
                    type="number"
                    required
                    value={athForm.bib}
                    onChange={(e) => setAthForm({ ...athForm, bib: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Affiliated Team</label>
                  <select
                    value={athForm.teamId}
                    onChange={(e) => setAthForm({ ...athForm, teamId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.shortCode})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                  <select
                    value={athForm.gender}
                    onChange={(e) => setAthForm({ ...athForm, gender: e.target.value as Gender })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Age Category</label>
                  <select
                    value={athForm.category}
                    onChange={(e) => setAthForm({ ...athForm, category: e.target.value as AgeCategory })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Senior">Senior / Open</option>
                    <option value="U20">U20</option>
                    <option value="U18">U18</option>
                    <option value="U16">U16</option>
                    <option value="Masters">Masters</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Competition District</label>
                  <select
                    value={athForm.district || 'District 1'}
                    onChange={(e) => setAthForm({ ...athForm, district: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="District 1">District 1</option>
                    <option value="District 2">District 2</option>
                    <option value="District 3">District 3</option>
                    <option value="District 4">District 4</option>
                    <option value="District 5">District 5</option>
                    <option value="District 6">District 6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">State / Province</label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="e.g. CA or TX"
                    value={athForm.state || 'CA'}
                    onChange={(e) => setAthForm({ ...athForm, state: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white uppercase focus:outline-none focus:border-blue-500 font-mono-timing"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={athForm.medicalCleared}
                    onChange={(e) => setAthForm({ ...athForm, medicalCleared: e.target.checked })}
                    className="rounded border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>Medical Examination / Health Clearance on File</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={athForm.waiverSigned}
                    onChange={(e) => setAthForm({ ...athForm, waiverSigned: e.target.checked })}
                    className="rounded border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>Liability Waiver & Anti-Doping Consent Signed</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAthleteModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Athlete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Team */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              {editingTeam ? 'Edit Team / Club' : 'Register New Team / Club'}
            </h3>

            <form onSubmit={handleSaveTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Track & Field"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Code (3-4 Chars)</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="APX"
                    value={teamForm.shortCode}
                    onChange={(e) => setTeamForm({ ...teamForm, shortCode: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white uppercase focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={teamForm.color}
                      onChange={(e) => setTeamForm({ ...teamForm, color: e.target.value })}
                      className="w-9 h-9 rounded cursor-pointer bg-slate-950 border border-slate-700 p-0.5"
                    />
                    <span className="text-xs text-slate-300 font-mono-timing">{teamForm.color}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Head Coach</label>
                  <input
                    type="text"
                    value={teamForm.coach}
                    onChange={(e) => setTeamForm({ ...teamForm, coach: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={teamForm.city}
                    onChange={(e) => setTeamForm({ ...teamForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">District</label>
                  <select
                    value={teamForm.district || 'District 1'}
                    onChange={(e) => setTeamForm({ ...teamForm, district: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="District 1">District 1</option>
                    <option value="District 2">District 2</option>
                    <option value="District 3">District 3</option>
                    <option value="District 4">District 4</option>
                    <option value="District 5">District 5</option>
                    <option value="District 6">District 6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Division</label>
                  <input
                    type="text"
                    value={teamForm.division}
                    onChange={(e) => setTeamForm({ ...teamForm, division: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
