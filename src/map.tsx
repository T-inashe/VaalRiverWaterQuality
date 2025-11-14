import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, Droplet, TrendingUp, Calendar } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type ParameterValue = 'pH' | 'Ammonia' | 'Chloride' | 'Ecoli' | 'COD' | string;

interface DataItem {
  id: string;
  name: string;
  quarter: number;
  year?: number;
  Ammonia: number;
  Chloride: number;
  Fluoride: number;
  MAlkalinity: number;
  Nitrate: number;
  Phosphate: number;
  Sulphate: number;
  COD: number;
  Conductivity: number;
  pH: number;
  Ecoli: number | null;
  lat: number;
  lng: number;
  [key: string]: any;
}

interface LocationCoord { name: string; lat: number; lng: number }

// CSV parsing function
const parseCSV = (csv: string): Record<string, any>[] => {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const row: Record<string, any> = {};
    
    headers.forEach((header, index) => {
      let value: any = values[index] || '';
      
      // Parse numeric values
      if (!isNaN(value) && value !== '') {
        value = parseFloat(value);
      }
      
      row[header] = value;
    });
    
    return row;
  });
};

// Convert CSV row to DataItem
const csvRowToDataItem = (row: Record<string, any>, year: number): DataItem => {
  return {
    id: row['Sample ID'] || '',
    name: row['Sample Point Description'] || '',
    quarter: row['Quarter'] || 0,
    year,
    Ammonia: parseFloat(row['Ammonia']) || 0,
    Chloride: parseFloat(row['Chloride']) || 0,
    Fluoride: parseFloat(row['Fluoride']) || 0,
    MAlkalinity: parseFloat(row['M-Alkalinity']) || 0,
    Nitrate: parseFloat(row['Nitrate']) || 0,
    Phosphate: parseFloat(row['Phosphate']) || 0,
    Sulphate: parseFloat(row['Sulphate']) || 0,
    COD: parseFloat(row['Chemical Oxygen Demand']) || 0,
    Conductivity: parseFloat(row['Conductivity']) || 0,
    pH: parseFloat(row['pH']) || 0,
    Ecoli: row['E. coli'] === -9999 || row['E. coli'] === '-9999' ? null : (parseFloat(row['E. coli']) || 0),
    lat: parseFloat(row['Latitude']) || 0,
    lng: parseFloat(row['Longitude']) || 0,
  };
};

const VaalWaterDashboard: React.FC = () => {
  const [rawData, setRawData] = useState<DataItem[]>([]);
  const [locationCoords, setLocationCoords] = useState<Record<string, LocationCoord>>({});
  const [loading, setLoading] = useState(true);

  // UI state
  const [selectedParameter, setSelectedParameter] = useState('pH');
  const [selectedLocation, setSelectedLocation] = useState(Object.keys(locationCoords)[0] || 'KB');
  const [selectedYearRange, setSelectedYearRange] = useState([2011, 2024]);
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'multi-year'

  // Load CSV files on component mount
  useEffect(() => {
    const loadCSVData = async () => {
      try {
        const allYears = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
        const allData: DataItem[] = [];
        const locCoords: Record<string, LocationCoord> = {};

        // Load each year's CSV
        for (const year of allYears) {
          const response = await fetch(`/data/${year}.csv`);
          const csvText = await response.text();
          const rows = parseCSV(csvText);

          rows.forEach(row => {
            const dataItem = csvRowToDataItem(row, year);
            allData.push(dataItem);

            // Build location coordinates map
            if (!locCoords[dataItem.id]) {
              locCoords[dataItem.id] = {
                name: dataItem.name,
                lat: dataItem.lat,
                lng: dataItem.lng,
              };
            }
          });
        }

        setRawData(allData);
        setLocationCoords(locCoords);
        setLoading(false);
      } catch (error) {
        console.error('Error loading CSV data:', error);
        setLoading(false);
      }
    };

    loadCSVData();
  }, []);

  // Ensure a valid default selection once locations are loaded
  useEffect(() => {
    if (Object.keys(locationCoords).length > 0 && !locationCoords[selectedLocation]) {
      const firstId = Object.keys(locationCoords)[0];
      if (firstId) setSelectedLocation(firstId);
    }
  }, [locationCoords, selectedLocation]);

  const allYears = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

  const parameters = [
    { value: 'pH', label: 'pH', unit: '', goodRange: [6.5, 8.5], colors: ['#ef4444', '#f59e0b', '#22c55e', '#f59e0b', '#ef4444'] },
    { value: 'Ammonia', label: 'Ammonia', unit: 'mg/L', goodRange: [0, 1], colors: ['#22c55e', '#f59e0b', '#ef4444'] },
    { value: 'Chloride', label: 'Chloride', unit: 'mg/L', goodRange: [0, 250], colors: ['#22c55e', '#f59e0b', '#ef4444'] },
    { value: 'Ecoli', label: 'E. coli', unit: 'cfu/100ml', goodRange: [0, 1000], colors: ['#22c55e', '#f59e0b', '#ef4444'] },
    { value: 'COD', label: 'COD', unit: 'mg/L', goodRange: [0, 30], colors: ['#22c55e', '#f59e0b', '#ef4444'] },
    { value: 'Conductivity', label: 'Conductivity', unit: 'mS/m', goodRange: [0, 170], colors: ['#22c55e', '#f59e0b', '#ef4444'] },
    { value: 'Nitrate', label: 'Nitrate', unit: 'mg/L', goodRange: [0, 50], colors: ['#22c55e', '#f59e0b', '#ef4444'] },
    { value: 'Phosphate', label: 'Phosphate', unit: 'mg/L', goodRange: [0, 0.1], colors: ['#22c55e', '#f59e0b', '#ef4444'] },
    { value: 'Fluoride', label: 'Fluoride', unit: 'mg/L', goodRange: [0, 1.5], colors: ['#22c55e', '#f59e0b', '#ef4444'] },
    { value: 'Sulphate', label: 'Sulphate', unit: 'mg/L', goodRange: [0, 250], colors: ['#22c55e', '#f59e0b', '#ef4444'] },
    { value: 'MAlkalinity', label: 'M-Alkalinity', unit: 'mg/L as CaCO3', goodRange: [20, 200], colors: ['#22c55e', '#f59e0b', '#ef4444'] },
  ];

  const getQualityStatus = (value: number | null, param: ParameterValue): { status: string; color: string } => {
    const paramInfo = parameters.find((p) => p.value === param);
    if (!paramInfo || value === null || value === undefined || Number.isNaN(value)) return { status: 'unknown', color: '#94a3b8' };

    const [min, max] = paramInfo.goodRange;

    if (param === 'pH') {
      if (value >= 6.5 && value <= 8.5) return { status: 'Good', color: '#22c55e' };
      if (value >= 6.0 && value <= 9.0) return { status: 'Moderate', color: '#f59e0b' };
      return { status: 'Poor', color: '#ef4444' };
    }

    if (value <= max * 0.5) return { status: 'Excellent', color: '#22c55e' };
    if (value <= max) return { status: 'Good', color: '#84cc16' };
    if (value <= max * 1.5) return { status: 'Moderate', color: '#f59e0b' };
    return { status: 'Poor', color: '#ef4444' };
  };

  const chartData = useMemo(() => {
    if (viewMode === 'single') {
      const year = selectedYearRange[1];
      const quarters = [1, 2, 3, 4];
      return quarters.map(q => {
        const record = rawData.find(d => d.id === selectedLocation && d.quarter === q && d.year === year);
        const value = record ? record[selectedParameter] : null;
        return {
          quarter: `Q${q} ${year}`,
          value: value !== null && value !== -9999 ? value : null,
          status: getQualityStatus(value, selectedParameter)
        };
      });
    } else {
      // Multi-year view: show annual averages
      return allYears.filter(y => y >= selectedYearRange[0] && y <= selectedYearRange[1]).map(year => {
        const yearData = rawData.filter(d => d.id === selectedLocation && d.year === year);
        const values = yearData.map(d => d[selectedParameter]).filter(v => v !== null && v !== -9999);
        const avgValue = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
        return {
          quarter: String(year),
          value: avgValue,
          status: getQualityStatus(avgValue, selectedParameter)
        };
      });
    }
  }, [selectedParameter, selectedLocation, selectedYearRange, viewMode, rawData, allYears]);

  const selectedParamInfo = parameters.find((p) => p.value === selectedParameter) || parameters[0];
  const currentValue: number | null = chartData[chartData.length - 1]?.value ?? null;
  const currentStatus = currentValue != null ? getQualityStatus(currentValue, selectedParameter) : { status: 'unknown', color: '#94a3b8' };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center p-4">
        <div className="text-white text-xl">Loading water quality data...</div>
      </div>
    );
  }

  return (
<div className="w-full">
  <div className="max-w-7xl mx-4">
        {/* Status and Map Side by Side (30% / 70%) */}
        <div className="flex flex-row gap-6 mb-6" style={{ width: '100%' }}>
          {/* Status Card - 30% */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20" style={{ flexBasis: '30%', width: '30%' }}>
            <h2 className="text-xl font-bold text-white mb-4">Water Chemistry Status</h2>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-sm text-cyan-200 mb-1">Location</div>
                <select
                  value={locationCoords[selectedLocation] ? selectedLocation : (Object.keys(locationCoords)[0] || '')}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '9999px',
                    padding: '0.5rem 0.75rem',
                    outline: 'none',
                  }}
                >
                  {Object.entries(locationCoords).length === 0 ? (
                    <option value="" style={{ color: '#0f172a' }}>Loading...</option>
                  ) : (
                    Object.entries(locationCoords)
                      .sort((a, b) => a[1].name.localeCompare(b[1].name))
                      .map(([id, loc]) => (
                        <option key={id} value={id} style={{ color: '#0f172a' }}>
                          {loc.name || id}
                        </option>
                      ))
                  )}
                </select>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-sm text-cyan-200 mb-1">Parameter</div>
                <select
                  value={selectedParameter}
                  onChange={(e) => setSelectedParameter(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '9999px',
                    padding: '0.5rem 0.75rem',
                    outline: 'none',
                  }}
                >
                  {parameters.map((p) => (
                    <option key={p.value} value={p.value} style={{ color: '#0f172a' }}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-sm text-cyan-200 mb-2">Water Quality</div>
                <div 
                  className="text-3xl font-bold mb-2"
                  style={{ color: currentStatus.color }}
                >
                  {currentValue != null && !Number.isNaN(currentValue) ? currentValue.toFixed(2) : 'N/A'} {selectedParamInfo?.unit ?? ''}
                </div>
                <div 
                  className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: currentStatus.color }}
                >
                  {currentStatus.status}
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-sm text-cyan-200 mb-2">Quality Scale</div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {['Excellent', 'Good', 'Moderate', 'Poor'].map(status => (
                    <div key={status} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        status === 'Excellent' ? 'bg-green-500' :
                        status === 'Good' ? 'bg-lime-500' :
                        status === 'Moderate' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <span className="text-xs text-white">{status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Moved: View Mode */}
              <div className="bg-white/5 rounded-xl p-4">
                <label className="block text-sm font-semibold text-cyan-100 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-300" />
                  View Mode
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('single')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-150 shadow focus:outline-none border border-white/20 ${viewMode === 'single' ? 'bg-cyan-300 text-cyan-900 scale-105 shadow-lg' : 'bg-white/10 text-white hover:bg-cyan-300 hover:text-cyan-900'}`}
                  >Quarterly</button>
                  <button
                    onClick={() => setViewMode('multi-year')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-150 shadow focus:outline-none border border-white/20 ${viewMode === 'multi-year' ? 'bg-cyan-300 text-cyan-900 scale-105 shadow-lg' : 'bg-white/10 text-white hover:bg-cyan-300 hover:text-cyan-900'}`}
                  >Annual</button>
                </div>
              </div>

              {/* Moved: Year Range */}
              <div className="bg-white/5 rounded-xl p-4">
                <label className="block text-sm font-semibold text-cyan-100 mb-2">Year Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="2011"
                    max="2024"
                    value={selectedYearRange[0]}
                    onChange={(e) => setSelectedYearRange([parseInt(e.target.value), selectedYearRange[1]])}
                    className="w-1/2 px-3 py-2 bg-white/20 border border-white/30 rounded-full text-cyan-900 font-bold focus:ring-2 focus:ring-cyan-400"
                  />
                  <input
                    type="number"
                    min="2011"
                    max="2024"
                    value={selectedYearRange[1]}
                    onChange={(e) => setSelectedYearRange([selectedYearRange[0], parseInt(e.target.value)])}
                    className="w-1/2 px-3 py-2 bg-white/20 border border-white/30 rounded-full text-cyan-900 font-bold focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Map Panel - 70% */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20" style={{ flexBasis: '70%', width: '70%' }}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Monitoring Locations - Vaal River Catchment
            </h2>
            <div className="rounded-xl overflow-hidden h-96 border-2 border-white/30">
              <MapContainer center={[-27.0, 28.5]} zoom={8} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
                <TileLayer
                  attribution="© OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {Object.entries(locationCoords).map(([id, loc]) => {
                  const isSelected = id === selectedLocation;
                  const markerIcon = L.icon({
                    iconUrl: isSelected
                      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'
                      : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                  });
                  return (
                    <Marker
                      key={id}
                      position={[loc.lat, loc.lng]}
                      icon={markerIcon}
                      eventHandlers={{
                        click: () => setSelectedLocation(id),
                      }}
                    >
                      <Popup>
                        <div style={{ minWidth: 120 }}>
                          <strong>{loc.name}</strong>
                          <br />
                          <span>Click to select</span>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
            <p className="text-cyan-100 text-xs mt-2">
              Click a marker to select a location • Red marker = selected
            </p>
          </div>
        </div>

  {/* Charts Side by Side */}
  <div className="flex flex-row gap-6" style={{width: '100%'}}>
          {/* Quarterly/Annual Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20" style={{flexBasis: '50%', width: '50%'}}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {viewMode === 'single' ? 'Quarterly Trends' : 'Annual Trends'}
            </h3>
            <p className="text-cyan-100 text-sm mb-4">{locationCoords[selectedLocation]?.name ?? '—'}</p>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="quarter" stroke="#fff" tick={{ fontSize: 12 }} />
                <YAxis stroke="#fff" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={{ fill: '#22d3ee', r: 6 }}
                  connectNulls={false}
                  name={selectedParamInfo?.label ?? selectedParameter}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Long-term Trend Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20" style={{flexBasis: '50%', width: '50%'}}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              14-Year Overview
            </h3>
            <p className="text-cyan-100 text-sm mb-4">{locationCoords[selectedLocation]?.name ?? '—'}</p>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={allYears.map(year => {
                const yearData = rawData.filter(d => d.id === selectedLocation && d.year === year);
                const values = yearData.map(d => d[selectedParameter]).filter(v => v !== null && v !== -9999);
                const avgValue = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
                return {
                  year: String(year),
                  value: avgValue
                };
              })}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="year" stroke="#fff" tick={{ fontSize: 12 }} />
                <YAxis stroke="#fff" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#a78bfa"
                  strokeWidth={3}
                  dot={{ fill: '#a78bfa', r: 6 }}
                  connectNulls={false}
                  name={selectedParamInfo?.label ?? selectedParameter}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaalWaterDashboard;