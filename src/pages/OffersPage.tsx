"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../integrations/supabase/session-context';
import { supabase } from '../integrations/supabase/client';
import { Offer } from '../types/database';
import { Button } from '../components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const OffersPage: React.FC = () => {
  const { user, profile, isLoading: authLoading } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      if (!user || !profile?.niche) { // Only fetch if user is logged in and has a creator profile
        setLoadingOffers(false);
        return;
      }

      setLoadingOffers(true);
      setError(null);

      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching offers:', error);
        setError('Failed to load offers.');
        toast.error('Failed to load offers.');
      } else {
        setOffers(data || []);
      }
      setLoadingOffers(false);
    };

    if (!authLoading) {
      fetchOffers();
    }
  }, [user, profile, authLoading]);

  if (authLoading || loadingOffers) {
    return <div className="p-8 text-center">Loading offers...</div>;
  }

  if (!profile?.niche) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Not a Creator Profile</h2>
        <p className="text-gray-600">
          You need to set your 'Niche' in your <Link to="/dashboard/profile" className="text-blue-600 hover:underline">profile settings</Link> to create and manage offers.
        </p>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Offers</h1>
        <Button asChild>
          <Link to="/dashboard/offers/new" className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Create New Offer
          </Link>
        </Button>
      </div>

      {offers.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-lg border">
          <p className="text-lg text-gray-600 mb-4">You haven't created any offers yet.</p>
          <Button asChild>
            <Link to="/dashboard/offers/new" className="flex items-center gap-2 mx-auto w-fit">
              <PlusCircle className="w-4 h-4" />
              Create Your First Offer
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{offer.title}</h2>
                <p className="text-gray-600 text-sm">{offer.description}</p>
                <p className="text-lg font-bold mt-2">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: offer.currency || 'USD' }).format(offer.price_cents / 100)}
                  <span className="text-sm font-normal text-gray-500"> / {offer.duration_days} days</span>
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" asChild>
                  <Link to={`/dashboard/offers/edit/${offer.id}`}>
                    <Edit className="w-4 h-4" />
                  </Link>
                </Button>
                {/* Delete functionality will be added later */}
                {/* <Button variant="destructive" size="icon">
                  <Trash2 className="w-4 h-4" />
                </Button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersPage;