import { supabase, Tables } from '@/lib/supabase';
import { Route, Stop } from '@/types';
import { format } from 'date-fns';

// Type definitions for API responses
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

// Organizations
export const getOrganizations = async (): Promise<ApiResponse<Tables<'organizations'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('name');

    return { data, error };
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return { data: null, error: error as Error };
  }
};

// Routes
export const getRoutes = async (status?: string): Promise<ApiResponse<Route[]>> => {
  try {
    console.log('Fetching routes from Supabase...');
    console.log('Supabase URL:', supabase.supabaseUrl);
    console.log('Status filter:', status || 'none');

    // First, check if the routes table exists
    try {
      const { data: tableCheck, error: tableError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public')
        .eq('tablename', 'routes');

      if (tableError) {
        console.error('Error checking routes table:', tableError);
      } else {
        console.log('Routes table check:', tableCheck);
      }
    } catch (tableCheckError) {
      console.error('Exception checking routes table:', tableCheckError);
    }

    // Now try to fetch the routes
    let query = supabase
      .from('routes')
      .select(`
        *,
        partner:partners(name, contact),
        stops:stops(
          id,
          sequence,
          name,
          address,
          type,
          status,
          time,
          contact_name,
          contact_phone,
          notes,
          samples:samples(id, type, status, quantity, collected_by, collection_time),
          attachments:attachments(id, name, type, url, size)
        )
      `)
      .order('date', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    console.log('Executing query...');
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching routes:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log(`Successfully fetched ${data?.length || 0} routes`);
    if (data && data.length > 0) {
      console.log('First route:', {
        id: data[0].id,
        name: data[0].name,
        trip_id: data[0].trip_id,
        stops: data[0].stops?.length || 0
      });
    }

    // Transform data to match the frontend model
    const routes: Route[] = data.map(route => {
      // Count registered and unregistered samples
      const samplesRegistered = route.stops.reduce((total, stop) => {
        return total + stop.samples.filter(sample => sample.status === 'registered').length;
      }, 0);

      const samplesUnregistered = route.stops.reduce((total, stop) => {
        return total + stop.samples.filter(sample => sample.status === 'unregistered')
          .reduce((sum, sample) => sum + sample.quantity, 0);
      }, 0);

      // Count attachments
      const attachments = route.stops.reduce((total, stop) => {
        return total + stop.attachments.length;
      }, 0);

      // Transform stops
      const transformedStops: Stop[] = route.stops.map(stop => {
        const stopSamplesRegistered = stop.samples.filter(sample => sample.status === 'registered').length;
        const stopSamplesUnregistered = stop.samples
          .filter(sample => sample.status === 'unregistered')
          .reduce((sum, sample) => sum + sample.quantity, 0);

        return {
          id: stop.sequence.toString(),
          name: stop.name,
          address: stop.address,
          type: stop.type,
          status: stop.status,
          time: stop.time ? format(new Date(`2000-01-01T${stop.time}`), 'h:mm a') : undefined,
          contactName: stop.contact_name || undefined,
          contactPhone: stop.contact_phone || undefined,
          notes: stop.notes || undefined,
          samplesRegistered: stopSamplesRegistered > 0 ? stopSamplesRegistered : undefined,
          samplesUnregistered: stopSamplesUnregistered > 0 ? stopSamplesUnregistered : undefined,
          attachments: stop.attachments.length > 0 ? true : undefined,
          samples: stop.samples.map(sample => ({
            id: sample.status === 'registered' ? sample.id : undefined,
            type: sample.type,
            quantity: sample.status === 'unregistered' ? sample.quantity : undefined,
            time: sample.collection_time ? format(new Date(sample.collection_time), 'h:mm a') : undefined,
            collectedBy: sample.collected_by || undefined,
            status: sample.status
          })),
          unregisteredSamples: stop.samples
            .filter(sample => sample.status === 'unregistered')
            .map(sample => ({
              type: sample.type,
              quantity: sample.quantity
            }))
        };
      });

      return {
        id: route.id,
        routeNo: route.trip_id,
        tripId: route.trip_id,
        name: route.name,
        date: format(new Date(route.date), 'MMM d, yyyy'),
        status: route.status,
        assignedTeam: route.assigned_team || undefined,
        partnerName: route.partner?.name || undefined,
        partnerContact: route.partner?.contact || undefined,
        stops: route.stops.length,
        stopCount: route.stops.length,
        samplesCollected: samplesRegistered,
        samplesRegistered,
        samplesUnregistered,
        attachments,
        stopsList: transformedStops
      };
    });

    return { data: routes, error: null };
  } catch (error) {
    console.error('Error fetching routes:', error);
    return { data: null, error: error as Error };
  }
};

export const getRouteById = async (id: string): Promise<ApiResponse<Route>> => {
  try {
    const { data: routes, error } = await getRoutes();

    if (error) throw error;

    const route = routes?.find(r => r.id === id) || null;

    return { data: route, error: null };
  } catch (error) {
    console.error(`Error fetching route ${id}:`, error);
    return { data: null, error: error as Error };
  }
};

export const createRoute = async (route: Partial<Route>): Promise<ApiResponse<Route>> => {
  try {
    // First, create the route
    const { data: routeData, error: routeError } = await supabase
      .from('routes')
      .insert({
        name: route.name,
        trip_id: route.tripId || `TR-${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        date: route.date,
        status: route.status || 'upcoming',
        assigned_team: route.assignedTeam
      })
      .select()
      .single();

    if (routeError) throw routeError;

    // Then, create stops if provided
    if (route.stopsList && route.stopsList.length > 0) {
      const stopsToInsert = route.stopsList.map((stop, index) => ({
        route_id: routeData.id,
        sequence: index + 1,
        name: stop.name,
        address: stop.address,
        type: stop.type === 'checkpoint' ? 'dropoff' : stop.type,
        status: 'pending',
        contact_name: stop.contactName,
        contact_phone: stop.contactPhone,
        notes: stop.notes
      }));

      const { error: stopsError } = await supabase
        .from('stops')
        .insert(stopsToInsert);

      if (stopsError) throw stopsError;
    }

    // Fetch the complete route with stops
    return await getRouteById(routeData.id);
  } catch (error) {
    console.error('Error creating route:', error);
    return { data: null, error: error as Error };
  }
};

export const updateRoute = async (id: string, route: Partial<Route>, updateAllTrips = false): Promise<ApiResponse<Route>> => {
  try {
    let query = supabase
      .from('routes')
      .update({
        name: route.name,
        date: route.date,
        status: route.status,
        assigned_team: route.assignedTeam
      });

    if (updateAllTrips) {
      // Update all routes with the same name
      const { data: currentRoute } = await supabase
        .from('routes')
        .select('name')
        .eq('id', id)
        .single();

      if (currentRoute) {
        query = query.eq('name', currentRoute.name);
      }
    } else {
      // Update only this specific route
      query = query.eq('id', id);
    }

    const { error: routeError } = await query;

    if (routeError) throw routeError;

    // Update stops if provided
    if (route.stopsList && route.stopsList.length > 0) {
      // First, delete existing stops
      const { error: deleteError } = await supabase
        .from('stops')
        .delete()
        .eq('route_id', id);

      if (deleteError) throw deleteError;

      // Then, insert new stops
      const stopsToInsert = route.stopsList.map((stop, index) => ({
        route_id: id,
        sequence: index + 1,
        name: stop.name,
        address: stop.address,
        type: stop.type === 'checkpoint' ? 'dropoff' : stop.type,
        status: stop.status || 'pending',
        contact_name: stop.contactName,
        contact_phone: stop.contactPhone,
        notes: stop.notes
      }));

      const { error: stopsError } = await supabase
        .from('stops')
        .insert(stopsToInsert);

      if (stopsError) throw stopsError;
    }

    // Fetch the updated route
    return await getRouteById(id);
  } catch (error) {
    console.error(`Error updating route ${id}:`, error);
    return { data: null, error: error as Error };
  }
};

export const cancelRoute = async (id: string, cancelAllTrips = false): Promise<ApiResponse<boolean>> => {
  try {
    let query = supabase
      .from('routes')
      .update({ status: 'cancelled' });

    if (cancelAllTrips) {
      // Cancel all routes with the same name
      const { data: currentRoute } = await supabase
        .from('routes')
        .select('name')
        .eq('id', id)
        .single();

      if (currentRoute) {
        query = query.eq('name', currentRoute.name);
      }
    } else {
      // Cancel only this specific route
      query = query.eq('id', id);
    }

    const { error } = await query;

    if (error) throw error;

    // Also update all stops to cancelled
    const { error: stopsError } = await supabase
      .from('stops')
      .update({ status: 'cancelled' })
      .eq('route_id', id);

    if (stopsError) throw stopsError;

    return { data: true, error: null };
  } catch (error) {
    console.error(`Error cancelling route ${id}:`, error);
    return { data: null, error: error as Error };
  }
};

// Stops
export const getStops = async (
  status?: string,
  dateRange?: { from?: Date; to?: Date },
  stopTypes?: string[],
  searchQuery?: string
): Promise<ApiResponse<any[]>> => {
  try {
    console.log('Fetching stops directly from Supabase...');
    console.log('Filters:', { status, dateRange, stopTypes, searchQuery });

    // Build the query to fetch stops with related data
    let query = supabase
      .from('stops')
      .select(`
        id,
        sequence,
        name,
        address,
        type,
        status,
        time,
        contact_name,
        contact_phone,
        notes,
        route:routes(
          id,
          name,
          trip_id,
          date,
          status,
          assigned_team
        ),
        samples:samples(id, type, status, quantity, collected_by, collection_time),
        attachments:attachments(id, name, type, url, size)
      `);

    // Apply date range filter to the routes
    if (dateRange) {
      if (dateRange.from) {
        const fromDate = dateRange.from.toISOString().split('T')[0];
        query = query.gte('route.date', fromDate);
      }
      if (dateRange.to) {
        const toDate = dateRange.to.toISOString().split('T')[0];
        query = query.lte('route.date', toDate);
      }
    }

    // Apply stop type filter
    if (stopTypes && stopTypes.length > 0) {
      query = query.in('type', stopTypes);
    }

    // Apply status filter
    if (status && status !== 'all') {
      if (status === 'active') {
        // Active includes both 'active' and 'in-progress'
        query = query.in('status', ['active', 'in-progress']);
      } else {
        query = query.eq('status', status);
      }
    }

    // Execute the query
    console.log('Executing stops query...');
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching stops:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log(`Successfully fetched ${data?.length || 0} stops`);

    // Apply search filter (client-side for flexibility)
    let filteredData = data;
    if (searchQuery && searchQuery.trim() !== '') {
      const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
      filteredData = data.filter(stop => {
        const route = stop.route;
        return searchTerms.some(term => {
          return (
            (route.trip_id && route.trip_id.toLowerCase().includes(term)) ||
            (route.name && route.name.toLowerCase().includes(term)) ||
            (stop.name && stop.name.toLowerCase().includes(term))
          );
        });
      });
      console.log(`Search filter applied: ${filteredData.length} stops match "${searchQuery}"`);
    }

    // Transform the data to match the frontend model
    const transformedStops = filteredData.map(stop => {
      const route = stop.route;
      const isDropoff = stop.type === 'dropoff';

      // Only pickup points have samples and attachments
      const stopSamplesRegistered = !isDropoff ?
        stop.samples.filter(sample => sample.status === 'registered').length : 0;

      const stopSamplesUnregistered = !isDropoff ?
        stop.samples.filter(sample => sample.status === 'unregistered')
          .reduce((sum, sample) => sum + sample.quantity, 0) : 0;

      const attachmentsCount = !isDropoff ? stop.attachments.length : 0;

      return {
        id: stop.id,
        routeId: route.id,
        tripId: route.trip_id,
        routeName: route.name,
        name: stop.name,
        address: stop.address,
        type: stop.type,
        time: stop.time ? format(new Date(`2000-01-01T${stop.time}`), 'h:mm a') : undefined,
        status: stop.status,
        contactName: stop.contact_name || undefined,
        contactPhone: stop.contact_phone || undefined,
        notes: stop.notes || undefined,
        // Only include samples and attachments for pickup points
        samplesRegistered: !isDropoff && stopSamplesRegistered > 0 ? stopSamplesRegistered : undefined,
        samplesUnregistered: !isDropoff && stopSamplesUnregistered > 0 ? stopSamplesUnregistered : undefined,
        attachments: !isDropoff && attachmentsCount > 0 ? attachmentsCount : undefined,
        route: {
          id: route.id,
          name: route.name,
          date: format(new Date(route.date), 'MMM d, yyyy'),
          assignedTeam: route.assigned_team || undefined,
          status: route.status
        },
        // Only include samples for pickup points
        samples: !isDropoff ? stop.samples.map(sample => ({
          id: sample.status === 'registered' ? sample.id : undefined,
          type: sample.type,
          quantity: sample.status === 'unregistered' ? sample.quantity : undefined,
          time: sample.collection_time ? format(new Date(sample.collection_time), 'h:mm a') : undefined,
          collectedBy: sample.collected_by || undefined,
          status: sample.status
        })) : []
      };
    });

    return { data: transformedStops, error: null };
  } catch (error) {
    console.error('Error fetching stops:', error);
    return { data: null, error: error as Error };
  }
};

export const updateStopStatus = async (routeId: string, stopId: string, status: string): Promise<ApiResponse<boolean>> => {
  try {
    const { error } = await supabase
      .from('stops')
      .update({ status })
      .eq('route_id', routeId)
      .eq('sequence', parseInt(stopId));

    if (error) throw error;

    return { data: true, error: null };
  } catch (error) {
    console.error(`Error updating stop status:`, error);
    return { data: null, error: error as Error };
  }
};

// Samples
export const addSamples = async (stopId: string, samples: any[]): Promise<ApiResponse<boolean>> => {
  try {
    const samplesToInsert = samples.map(sample => ({
      stop_id: stopId,
      type: sample.type,
      status: sample.status || 'registered',
      quantity: sample.quantity || 1,
      collected_by: sample.collectedBy,
      collection_time: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('samples')
      .insert(samplesToInsert);

    if (error) throw error;

    return { data: true, error: null };
  } catch (error) {
    console.error(`Error adding samples:`, error);
    return { data: null, error: error as Error };
  }
};

// Attachments
export const uploadAttachment = async (stopId: string, file: File): Promise<ApiResponse<any>> => {
  try {
    // Upload file to storage
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `attachments/${stopId}/${fileName}`;

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('route-runner-attachments')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('route-runner-attachments')
      .getPublicUrl(filePath);

    // Add attachment record
    const { error: attachmentError, data: attachmentData } = await supabase
      .from('attachments')
      .insert({
        stop_id: stopId,
        name: file.name,
        type: file.type.split('/')[0] || 'file',
        url: urlData.publicUrl,
        size: file.size
      })
      .select()
      .single();

    if (attachmentError) throw attachmentError;

    return { data: attachmentData, error: null };
  } catch (error) {
    console.error(`Error uploading attachment:`, error);
    return { data: null, error: error as Error };
  }
};

// Teams
export const getTeams = async (): Promise<ApiResponse<Tables<'teams'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name');

    return { data, error };
  } catch (error) {
    console.error('Error fetching teams:', error);
    return { data: null, error: error as Error };
  }
};

// Partners
export const getPartners = async (): Promise<ApiResponse<Tables<'partners'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('name');

    return { data, error };
  } catch (error) {
    console.error('Error fetching partners:', error);
    return { data: null, error: error as Error };
  }
};
