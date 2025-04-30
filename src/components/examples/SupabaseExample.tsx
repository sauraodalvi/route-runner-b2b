import { useState, useEffect } from 'react';
import { getRoutes, getOrganizations, getTeams } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export function SupabaseExample() {
  const [activeTab, setActiveTab] = useState('routes');
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (tab: string) => {
    setLoading(true);
    setError(null);

    try {
      switch (tab) {
        case 'routes':
          const { data: routesData, error: routesError } = await getRoutes();
          if (routesError) throw routesError;
          setRoutes(routesData || []);
          break;
        case 'organizations':
          const { data: orgsData, error: orgsError } = await getOrganizations();
          if (orgsError) throw orgsError;
          setOrganizations(orgsData || []);
          break;
        case 'teams':
          const { data: teamsData, error: teamsError } = await getTeams();
          if (teamsError) throw teamsError;
          setTeams(teamsData || []);
          break;
      }
    } catch (err) {
      console.error(`Error fetching ${tab}:`, err);
      setError(`Failed to load ${tab}. Please check your Supabase configuration.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'upcoming':
        return 'outline';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Supabase Integration Example</CardTitle>
        <CardDescription>
          This example demonstrates fetching data from Supabase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              {error}
            </div>
          ) : (
            <>
              <TabsContent value="routes" className="space-y-4">
                {routes.length > 0 ? (
                  <div className="grid gap-4">
                    {routes.slice(0, 5).map((route) => (
                      <div key={route.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{route.name}</h3>
                            <p className="text-sm text-muted-foreground">{route.date}</p>
                          </div>
                          <Badge variant={getBadgeVariant(route.status)}>
                            {route.status}
                          </Badge>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Trip ID</p>
                            <p>{route.tripId}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Stops</p>
                            <p>{route.stops}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Team</p>
                            <p>{route.assignedTeam || 'Unassigned'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">No routes found</p>
                )}
              </TabsContent>

              <TabsContent value="organizations" className="space-y-4">
                {organizations.length > 0 ? (
                  <div className="grid gap-4">
                    {organizations.slice(0, 5).map((org) => (
                      <div key={org.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{org.name}</h3>
                            <p className="text-sm text-muted-foreground">{org.address}, {org.city}</p>
                          </div>
                          <Badge variant="outline">
                            {org.payment_type}
                          </Badge>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Contact</p>
                            <p>{org.contact_name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Phone</p>
                            <p>{org.contact_phone || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">No organizations found</p>
                )}
              </TabsContent>

              <TabsContent value="teams" className="space-y-4">
                {teams.length > 0 ? (
                  <div className="grid gap-4">
                    {teams.map((team) => (
                      <div key={team.id} className="border rounded-md p-4">
                        <h3 className="font-medium">{team.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Created: {new Date(team.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">No teams found</p>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={() => fetchData(activeTab)} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Refresh Data'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
