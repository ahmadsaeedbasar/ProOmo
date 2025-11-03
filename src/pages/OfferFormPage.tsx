"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../integrations/supabase/session-context';
import { supabase } from '../integrations/supabase/client';
import { Offer } from '../types/database';
import toast from 'react-hot-toast';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';

const offerTypes = ['story', 'post', 'header', 'bio_mention', 'custom'];

const OfferFormPage: React.FC = () => {
  const { user, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { id: offerId } = useParams<{ id: string }>(); // For editing existing offers

  const [formData, setFormData] = useState<Partial<Offer>>({
    title: '',
    type: 'story',
    description: '',
    price_cents: 0,
    currency: 'USD',
    duration_days: 1,
    availability: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loadingOffer, setLoadingOffer] = useState(!!offerId); // True if editing, false if creating

  useEffect(() => {
    if (!authLoading && (!user || !profile?.niche)) {
      toast.error('You must be a logged-in creator to manage offers.');
      navigate('/dashboard/profile'); // Redirect if not a creator
      return;
    }

    if (offerId) {
      const fetchOffer = async () => {
        setLoadingOffer(true);
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .eq('id', offerId)
          .eq('user_id', user?.id) // Ensure user can only edit their own offers
          .single();

        if (error) {
          console.error('Error fetching offer:', error);
          toast.error('Failed to load offer: ' + error.message);
          navigate('/dashboard/offers');
        } else if (data) {
          setFormData(data as Offer);
        } else {
          toast.error('Offer not found or you do not have permission to edit it.');
          navigate('/dashboard/offers');
        }
        setLoadingOffer(false);
      };
      fetchOffer();
    }
  }, [offerId, user, profile, authLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSelectChange = (value: string, id: keyof Offer) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, availability: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Basic validation
    if (!formData.title || !formData.type || !formData.price_cents || !formData.duration_days) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (formData.price_cents <= 0 || formData.duration_days <= 0) {
      toast.error('Price and duration must be positive numbers.');
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading(offerId ? 'Updating offer...' : 'Creating offer...');

    let error = null;
    if (offerId) {
      // Update existing offer
      const { error: updateError } = await supabase
        .from('offers')
        .update({
          ...formData,
          updated_at: new Date().toISOString(), // Add updated_at if your table has it
        })
        .eq('id', offerId)
        .eq('user_id', user.id);
      error = updateError;
    } else {
      // Create new offer
      const { error: insertError } = await supabase
        .from('offers')
        .insert({
          ...formData,
          user_id: user.id,
          created_at: new Date().toISOString(),
        });
      error = insertError;
    }

    toast.dismiss(loadingToast);
    setIsSaving(false);

    if (error) {
      console.error('Error saving offer:', error);
      toast.error('Failed to save offer: ' + error.message);
    } else {
      toast.success(offerId ? 'Offer updated successfully!' : 'Offer created successfully!');
      navigate('/dashboard/offers');
    }
  };

  if (authLoading || loadingOffer) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {offerId ? 'Edit Offer' : 'Create New Offer'}
      </h1>
      <p className="mb-8 text-gray-600">
        Define the details of your service for brands to discover.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Offer Title *</Label>
          <Input id="title" value={formData.title || ''} onChange={handleChange} required placeholder="e.g., Instagram Story Shoutout" />
        </div>

        <div>
          <Label htmlFor="type">Offer Type *</Label>
          <Select value={formData.type || ''} onValueChange={(value) => handleSelectChange(value, 'type')}>
            <SelectTrigger>
              <SelectValue placeholder="Select an offer type" />
            </SelectTrigger>
            <SelectContent>
              {offerTypes.map(type => (
                <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={formData.description || ''} onChange={handleChange} rows={4} placeholder="Describe what your offer includes..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price_cents">Price (in cents) *</Label>
            <Input
              id="price_cents"
              type="number"
              value={formData.price_cents || 0}
              onChange={handleChange}
              required
              min="0"
              placeholder="e.g., 25000 for $250.00"
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency *</Label>
            <Input id="currency" value={formData.currency || 'USD'} onChange={handleChange} required placeholder="e.g., USD" />
          </div>
        </div>

        <div>
          <Label htmlFor="duration_days">Duration (days) *</Label>
          <Input
            id="duration_days"
            type="number"
            value={formData.duration_days || 1}
            onChange={handleChange}
            required
            min="1"
            placeholder="e.g., 1 for a 24-hour story"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="availability"
            checked={formData.availability}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="availability">Available for new promotions</Label>
        </div>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : (offerId ? 'Update Offer' : 'Create Offer')}
        </Button>
      </form>
    </div>
  );
};

export default OfferFormPage;