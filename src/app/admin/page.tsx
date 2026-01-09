'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const SmsTester = dynamic(() => import('@/components/admin/SmsTester'), {
  ssr: false,
  loading: () => <p>Loading Tester...</p>,
});

type Booking = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  preferred_date: string;
  status: 'confirmed' | 'canceled' | 'pending';
  estimated_price: number;
};

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // MANUAL FORM STATE
  const [showManualForm, setShowManualForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    date: '',
    time: '09:00',
    price: '150',
    serviceType: 'Standard Clean',
    homeSize: '1000-2000 sq ft', 
    bathrooms: '1',
    cleaningNeeds: '' // <--- NEW STATE
  });

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.bookings) setBookings(data.bookings);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      const res = await fetch('/api/cancel-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });
      if (res.ok) {
        alert('Cancelled!');
        fetchBookings();
      } else {
        const d = await res.json();
        alert('Error: ' + d.error);
      }
    } catch (e) { alert('Connection failed'); }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm('Create this booking?')) return;

    try {
        const res = await fetch('/api/manual-booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await res.json();
        
        if (res.ok) {
            alert('✅ Booking Created Successfully!');
            setShowManualForm(false);
            setFormData({ ...formData, name: '', email: '', phone: '', address: '', cleaningNeeds: '' }); 
            fetchBookings(); 
        } else {
            alert('Error: ' + data.error);
        }
    } catch (err) {
        alert('Failed to submit');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="space-x-4">
            <button 
                onClick={() => setShowManualForm(!showManualForm)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
            >
                {showManualForm ? 'Close Form' : '+ New Manual Booking'}
            </button>
            <button 
                onClick={fetchBookings}
                className="text-sm bg-white border px-3 py-2 rounded hover:bg-gray-100"
            >
                Refresh
            </button>
          </div>
        </div>

        {/* --- MANUAL BOOKING FORM --- */}
        {showManualForm && (
            <div className="bg-white p-6 rounded-lg shadow-lg border border-green-200 mb-8 animate-in fade-in slide-in-from-top-4">
                <h2 className="text-xl font-bold mb-4 text-green-800">Create New Booking</h2>
                <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required placeholder="Customer Name" className="border p-2 rounded" 
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    
                    <input placeholder="Email (Optional)" className="border p-2 rounded" 
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    
                    <input placeholder="Phone (e.g. 4145550199)" className="border p-2 rounded" 
                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />

                    <input required placeholder="Address" className="border p-2 rounded" 
                        value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />

                    <input required type="date" className="border p-2 rounded" 
                        value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                    
                    <input type="time" className="border p-2 rounded" 
                        value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />

                    <select className="border p-2 rounded" 
                        value={formData.homeSize} onChange={e => setFormData({...formData, homeSize: e.target.value})}>
                        <option>Under 1000 sq ft</option>
                        <option>1000-2000 sq ft</option>
                        <option>2000-3000 sq ft</option>
                        <option>3000-4000 sq ft</option>
                        <option>4000+ sq ft</option>
                    </select>

                    <select className="border p-2 rounded" 
                        value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})}>
                        <option value="1">1 Bathroom</option>
                        <option value="2">2 Bathrooms</option>
                        <option value="3">3 Bathrooms</option>
                        <option value="4">4 Bathrooms</option>
                        <option value="5">5+ Bathrooms</option>
                    </select>

                    <select className="border p-2 rounded md:col-span-2" 
                        value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})}>
                        <option>Standard Clean</option>
                        <option>Deep Clean</option>
                        <option>Move-In/Out</option>
                    </select>

                    {/* NEW INPUT: NOTES / CLEANING NEEDS */}
                    <input placeholder="Notes / Specific Needs (e.g. Key in lockbox)" className="border p-2 rounded md:col-span-2" 
                        value={formData.cleaningNeeds} onChange={e => setFormData({...formData, cleaningNeeds: e.target.value})} />

                    <div className="flex items-center md:col-span-2">
                        <span className="mr-2 text-gray-500">$</span>
                        <input type="number" placeholder="Price" className="border p-2 rounded w-full" 
                            value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>

                    <div className="md:col-span-2 mt-2">
                        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 font-medium">
                            Confirm Booking
                        </button>
                    </div>
                </form>
            </div>
        )}

        {/* BOOKINGS TABLE */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-10">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">Recent Bookings</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No bookings found yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Service</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{booking.name}</div>
                        <div className="text-gray-400 text-xs">{booking.email}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                         {new Date(booking.preferred_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                            booking.status === 'canceled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}
                        `}>
                          {booking.status?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded border border-red-200 text-xs font-medium transition"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Developer Tools</h2>
          <SmsTester />
        </div>
      </div>
    </div>
  );
}