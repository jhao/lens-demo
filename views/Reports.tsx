import React, { useEffect, useState } from 'react';
import { getSessions } from '../services/storageService';
import Card from '../components/Card';
import * as Icon from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface ReportsProps {
  language: Language;
}

const Reports: React.FC<ReportsProps> = ({ language }) => {
  const t = translations[language].reports;
  
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    avgDuration: 0,
    stressReduced: 0,
    scenarioData: [] as any[]
  });

  useEffect(() => {
    const sessions = getSessions();
    const total = sessions.length;
    
    // Mock week filter logic
    const thisWeek = sessions.filter(s => {
       const d = new Date(s.timestamp);
       const now = new Date();
       return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
    }).length;

    const avgDuration = total > 0 
      ? Math.round(sessions.reduce((a, b) => a + b.durationSeconds, 0) / total / 60) 
      : 0;

    const stressReduced = total > 0
       ? Math.round(sessions.reduce((a, b) => a + (b.hrvStart - b.hrvEnd), 0) / total)
       : 0;

    // Scenarios
    const scenarios = sessions.reduce((acc, s) => {
       const type = s.type === 'commute' ? 'Commute' : 'General';
       acc[type] = (acc[type] || 0) + 1;
       return acc;
    }, {} as Record<string, number>);

    const scenarioData = Object.keys(scenarios).map(k => ({ name: k, value: scenarios[k] }));
    if(scenarioData.length === 0) scenarioData.push({name: t.empty, value: 1}); // Placeholder

    setStats({ total, thisWeek, avgDuration, stressReduced, scenarioData });
  }, [t.empty]);

  const COLORS = ['#6366f1', '#f59e0b', '#ec4899', '#10b981'];

  return (
    <div className="p-6 space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>

      <div className="grid grid-cols-2 gap-4">
         <Card className="flex flex-col items-center justify-center py-6">
            <span className="text-4xl font-bold text-primary">{stats.thisWeek}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wide mt-2">{t.sessions_7d}</span>
         </Card>
         <Card className="flex flex-col items-center justify-center py-6">
            <span className="text-4xl font-bold text-green-500">-{stats.stressReduced}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wide mt-2">{t.avg_stress_lvl}</span>
         </Card>
      </div>

      <Card>
         <h3 className="font-bold text-gray-700 mb-4">{t.context_dist}</h3>
         <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                  <Pie
                     data={stats.scenarioData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                  >
                     {stats.scenarioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                  </Pie>
                  <Tooltip />
               </PieChart>
            </ResponsiveContainer>
         </div>
         <div className="flex justify-center gap-4 mt-2">
            {stats.scenarioData.map((entry, index) => (
               <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name}
               </div>
            ))}
         </div>
      </Card>
      
      <div className="bg-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden">
         <Icon.TrendingUp className="absolute right-4 bottom-4 text-white/10 w-24 h-24" />
         <h3 className="font-bold text-lg mb-2">{t.consistency_streak}</h3>
         <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">2</span>
            <span className="text-indigo-200">{t.days}</span>
         </div>
         <p className="text-sm text-indigo-200 mt-2">{t.streak_msg}</p>
      </div>
    </div>
  );
};

export default Reports;
