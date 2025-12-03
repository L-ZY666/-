import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { ReviewScores } from '../types';

interface ScoreChartProps {
  scores: ReviewScores;
}

const ScoreChart: React.FC<ScoreChartProps> = ({ scores }) => {
  const data = [
    { subject: 'Logic', A: scores.logic, fullMark: 100 },
    { subject: 'Content', A: scores.content, fullMark: 100 },
    { subject: 'Structure', A: scores.structure, fullMark: 100 },
    { subject: 'Scientific', A: scores.scientific, fullMark: 100 },
    { subject: 'Feasibility', A: scores.feasibility, fullMark: 100 },
  ];

  return (
    <div className="w-full h-[300px] bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">Evaluation Radar</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Review Score"
            dataKey="A"
            stroke="#10b981"
            strokeWidth={3}
            fill="#10b981"
            fillOpacity={0.2}
          />
          <Tooltip 
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
             itemStyle={{ color: '#10b981', fontWeight: 600 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;
