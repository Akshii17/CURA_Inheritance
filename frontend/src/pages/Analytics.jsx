import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { ShoppingBag, Users, Wallet, Activity, Clock, Hexagon, User } from 'lucide-react';

const chartData = [
  { name: 'Mon', eth: 1.2, sales: 4 },
  { name: 'Tue', eth: 2.1, sales: 8 },
  { name: 'Wed', eth: 1.8, sales: 6 },
  { name: 'Thu', eth: 3.2, sales: 12 },
  { name: 'Fri', eth: 2.4, sales: 9 },
  { name: 'Sat', eth: 4.5, sales: 15 },
  { name: 'Sun', eth: 3.8, sales: 11 },
];

const earningsData = [
  { name: 'Mon', primary: 0.8, secondary: 0.4 },
  { name: 'Tue', primary: 1.5, secondary: 0.6 },
  { name: 'Wed', primary: 1.2, secondary: 0.6 },
  { name: 'Thu', primary: 2.5, secondary: 0.7 },
  { name: 'Fri', primary: 1.8, secondary: 0.6 },
  { name: 'Sat', primary: 3.5, secondary: 1.0 },
  { name: 'Sun', primary: 2.8, secondary: 1.0 },
];

const saleTypeData = [
  { name: 'Direct Sale', value: 45 },
  { name: 'Auction', value: 30 },
  { name: 'Fractional', value: 25 },
];

const recentSales = [
  { id: 1, item: "Abstract #44", price: "0.85 ETH", user: "@kanye_east", time: "2h ago", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&q=80" },
  { id: 2, item: "Cube Genesis", price: "2.10 ETH", user: "@crypto_king", time: "5h ago", img: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=100&q=80" },
  { id: 3, item: "Neon Dreams", price: "1.45 ETH", user: "@sarah_art", time: "1d ago", img: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=100&q=80" },
];

const COLORS = ['#ffffff', '#a3a3a3', '#525252'];

//helper1: anim num(for text)
const AnimatedNumber = ({ value }) => {
  const match = value.toString().match(/([\d.]+)(.*)/);
  const numberPart = match ? parseFloat(match[1]) : 0;
  const labelPart = match ? match[2] : '';
  
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const end = numberPart;
          const duration = 1500;
          const increment = end / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setDisplayValue(end);
              clearInterval(timer);
            } else {
              setDisplayValue(start);
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [numberPart]);

  const formatted = numberPart % 1 !== 0 ? displayValue.toFixed(1) : Math.floor(displayValue);

  return <span ref={ref}>{formatted}{labelPart}</span>;
};

// helper2: chart on scroll
const ChartOnScroll = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      { threshold: 0.3 } 
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-full w-full">
      {isVisible ? children : null}
    </div>
  );
};


//main
export default function AnalyticsPage() {
  const [barDisplay, setBarDisplay] = useState({ 
    value: '65', 
    label: 'Total Weekly Sales',
    isHovering: false 
  });

  const handleBarEnter = (data) => {
    setBarDisplay({
      value: data.sales,
      label: `Sales ${data.name}`, 
      isHovering: true
    });
  };

  const handleBarLeave = () => {
    setBarDisplay({
      value: '65',
      label: 'Total Weekly Sales',
      isHovering: false
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white">
    
      
      {/* Background blobs */}

      <div className="relative z-10 p-12">
        <div className="mx-auto max-w-[1400px]">
          
          <div className="mb-10">
            <h1 className="mb-2 font-serif text-4xl font-normal">Artist Dashboard</h1>
            <p className="text-gray-400">Welcome back. Here is your artwork sales performance.</p>
          </div>

          {/*charts*/}
          <div className="mb-10 grid gap-6 grid-cols-[repeat(auto-fit,minmax(500px,1fr))]">
            
            {/*Revenue History */}
            <div className="rounded-3xl border border-white/5 bg-[#111]/60 p-6 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="m-0 text-xl font-medium">Revenue History</h3>
                <select className="rounded-lg border border-white/10 bg-black/30 px-3 py-1 text-xs text-gray-400">
                  <option>Last 7 Days</option>
                </select>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorEth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}Ξ`} />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                    <Area type="monotone" dataKey="eth" stroke="#fff" strokeWidth={2} fillOpacity={1} fill="url(#colorEth)" animationDuration={1500} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* no. of buys*/}
            <div className="rounded-3xl border border-white/5 bg-[#111]/60 p-6 backdrop-blur-xl">
              <div className="mb-6 min-h-[60px] text-center">
                <div className="text-[13px] uppercase tracking-widest text-gray-400">Number of Buys</div>
                <div className={`font-serif text-[32px] font-bold transition-all duration-200 ${barDisplay.isHovering ? 'text-white' : 'text-[#e5e5e5]'}`}>
                  {barDisplay.value}
                  <span className="ml-2 font-sans text-base font-normal text-gray-500">
                      {barDisplay.label}
                  </span>
                </div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} onMouseLeave={handleBarLeave}>
                    <defs>
                      <linearGradient id="shinyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity={1}/>
                        <stop offset="40%" stopColor="#d4d4d4" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#737373" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <Bar dataKey="sales" fill="url(#shinyGradient)" radius={[4, 4, 0, 0]} onMouseEnter={handleBarEnter} animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* sales dist*/}
            <div className="rounded-3xl border border-white/5 bg-[#111]/60 p-6 backdrop-blur-xl">
              <h3 className="mb-6 m-0 text-xl font-medium">Sale Type Distribution</h3>
              <div className="h-[250px] w-full">
                <ChartOnScroll>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={saleTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                        {saleTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span className="text-gray-400">{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartOnScroll>
              </div>
            </div>

            {/* earning source*/}
            <div className="rounded-3xl border border-white/5 bg-[#111]/60 p-6 backdrop-blur-xl">
              <h3 className="mb-6 m-0 text-xl font-medium">Earnings Source</h3>
              <div className="h-[250px] w-full">
                <ChartOnScroll>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={earningsData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                      <XAxis type="number" stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#666" tick={{fontSize: 12}} tickLine={false} axisLine={false} width={40} />
                      <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                      <Legend verticalAlign="top" height={36} iconType="circle" formatter={(value) => <span className="text-gray-400">{value}</span>}/>
                      <Bar dataKey="primary" stackId="a" name="Primary Sales" fill="#ffffff" radius={[0, 4, 4, 0]} animationDuration={1500} />
                      <Bar dataKey="secondary" stackId="a" name="Royalties" fill="#525252" radius={[0, 4, 4, 0]} animationDuration={1500} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartOnScroll>
              </div>
            </div>
          </div>

          {/* stats*/}
          <div className="mb-10 grid grid-cols-3 gap-6">
            <StatCard title="Total Earnings" value="14.2 ETH" icon={<Wallet size={20} />} animated={true} />
            <StatCard title="Purchases" value="24" icon={<ShoppingBag size={20} />} animated={true} />
            <StatCard title="Total Sales" value="185" icon={<Activity size={20} />} animated={true} />
          </div>

          {/*table*/}
          <div className="rounded-3xl border border-white/5 bg-[#111]/60 p-6 backdrop-blur-xl">
            <h3 className="mb-6 m-0 text-xl font-medium">Recent Sales</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-gray-500">
                    <th className="pb-4 pl-4 font-normal">Item</th>
                    <th className="pb-4 font-normal">Buyer</th>
                    <th className="pb-4 font-normal">Price</th>
                    <th className="pb-4 font-normal">Time</th>
                    <th className="pb-4 pr-4 text-right font-normal">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentSales.map((sale) => (
                    <tr key={sale.id} className="border-b border-white/5 last:border-0">
                      <td className="flex items-center gap-3 p-4">
                        <img src={sale.img} alt="" className="h-10 w-10 rounded-lg object-cover" />
                        <span className="font-medium text-white">{sale.item}</span>
                      </td>
                      <td className="p-4 text-gray-300">{sale.user}</td>
                      <td className="p-4 font-bold text-white">{sale.price}</td>
                      <td className="p-4 text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={14} /> {sale.time}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white">
                          Confirmed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

//card component for stats
function StatCard({ title, value, icon, animated }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#111]/60 p-6 backdrop-blur-xl transition-colors">
      <div className="mb-4 flex items-start justify-between">
        <div className="rounded-lg bg-white/5 p-2 text-gray-400">
          {icon}
        </div>
      </div>
      <div className="mb-1 text-xs uppercase tracking-wider text-gray-400">{title}</div>
      <div className="font-serif text-2xl font-bold">
        {animated ? <AnimatedNumber value={value} /> : value}
      </div>
    </div>
  );
}