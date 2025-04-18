import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building, Plus, Search, Edit, Trash2, Check, X } from "lucide-react";

// Sample organizations data
const initialOrganizations = [
  { id: "1", name: "Medlife Hospital", address: "123 Main St, Suite 400, New York, NY 10001", inSystem: true },
  { id: "2", name: "City Medical Center", address: "456 Park Ave, New York, NY 10002", inSystem: true },
  { id: "3", name: "HealthFirst Clinic", address: "789 Broadway, New York, NY 10003", inSystem: true },
  { id: "4", name: "CarePoint Diagnostics", address: "321 5th Ave, New York, NY 10004", inSystem: true },
  { id: "5", name: "New Medical Facility", address: "555 Hudson St, New York, NY 10014", inSystem: false },
];

interface Organization {
  id: string;
  name: string;
  address: string;
  inSystem: boolean;
}

export function OrganizationManagement() {
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);
  const [searchQuery, setSearchQuery] = useState("");
  const [newOrg, setNewOrg] = useState({ name: "", address: "", inSystem: false });
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddOrganization = () => {
    if (!newOrg.name || !newOrg.address) {
      toast({
        title: "Missing information",
        description: "Please enter both name and address for the organization",
        variant: "destructive",
      });
      return;
    }

    const newOrgWithId = {
      ...newOrg,
      id: (organizations.length + 1).toString(),
    };

    setOrganizations([...organizations, newOrgWithId]);
    setNewOrg({ name: "", address: "", inSystem: false });

    toast({
      title: "Organization added",
      description: `${newOrg.name} has been added to the organization list`,
    });
  };

  const handleEditOrganization = (org: Organization) => {
    setEditingOrg(org);
  };

  const handleSaveEdit = () => {
    if (!editingOrg) return;

    setOrganizations(
      organizations.map((org) =>
        org.id === editingOrg.id ? editingOrg : org
      )
    );

    setEditingOrg(null);

    toast({
      title: "Organization updated",
      description: `${editingOrg.name} has been updated`,
    });
  };

  const handleDeleteOrganization = (id: string) => {
    setOrganizations(organizations.filter((org) => org.id !== id));

    toast({
      title: "Organization deleted",
      description: "The organization has been removed from the list",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Building className="mr-2 h-5 w-5" />
            Organization Management
          </CardTitle>
          <CardDescription>
            Add, edit, or remove organizations for pickup points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search organizations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Add New Organization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      placeholder="Enter organization name"
                      value={newOrg.name}
                      onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="orgAddress">Address</Label>
                    <Input
                      id="orgAddress"
                      placeholder="Enter address"
                      value={newOrg.address}
                      onChange={(e) => setNewOrg({ ...newOrg, address: e.target.value })}
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id="inSystem"
                        checked={newOrg.inSystem}
                        onCheckedChange={(checked) =>
                          setNewOrg({ ...newOrg, inSystem: checked === true })
                        }
                      />
                      <Label htmlFor="inSystem">Already in system</Label>
                    </div>
                    <Button className="ml-auto" onClick={handleAddOrganization}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Organization
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrganizations.length > 0 ? (
                    filteredOrganizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell>
                          {editingOrg?.id === org.id ? (
                            <Input
                              value={editingOrg.name}
                              onChange={(e) =>
                                setEditingOrg({ ...editingOrg, name: e.target.value })
                              }
                            />
                          ) : (
                            <div className="font-medium">{org.name}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingOrg?.id === org.id ? (
                            <Input
                              value={editingOrg.address}
                              onChange={(e) =>
                                setEditingOrg({ ...editingOrg, address: e.target.value })
                              }
                            />
                          ) : (
                            org.address
                          )}
                        </TableCell>
                        <TableCell>
                          {editingOrg?.id === org.id ? (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`edit-inSystem-${org.id}`}
                                checked={editingOrg.inSystem}
                                onCheckedChange={(checked) =>
                                  setEditingOrg({
                                    ...editingOrg,
                                    inSystem: checked === true,
                                  })
                                }
                              />
                              <Label htmlFor={`edit-inSystem-${org.id}`}>In system</Label>
                            </div>
                          ) : (
                            <Badge
                              variant={org.inSystem ? "default" : "outline"}
                              className={
                                org.inSystem
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "text-orange-500 border-orange-500"
                              }
                            >
                              {org.inSystem ? "In System" : "Not in System"}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {editingOrg?.id === org.id ? (
                            <div className="flex justify-end space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleSaveEdit}
                                className="h-8 w-8 p-0 text-green-500"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingOrg(null)}
                                className="h-8 w-8 p-0 text-red-500"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditOrganization(org)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteOrganization(org.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        No organizations found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredOrganizations.length} of {organizations.length} organizations
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
