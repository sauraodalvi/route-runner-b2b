
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, MapPin } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Stop } from "./CreateRouteForm";
import { toast } from "@/hooks/use-toast";

interface AddStopFormProps {
  onSubmit: (stop: Stop) => void;
  onCancel: () => void;
  initialData?: Stop | null;
}

const timeSlots = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", 
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
];

const organizations = [
  { id: "1", name: "Medlife Hospital" },
  { id: "2", name: "City Medical Center" },
  { id: "3", name: "HealthFirst Clinic" },
  { id: "4", name: "CarePoint Diagnostics" },
];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["pickup", "checkpoint"]),
  address: z.string().min(5, "Address must be at least 5 characters"),
  time: z.string().optional(),
  organization: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
});

export function AddStopForm({ onSubmit, onCancel, initialData }: AddStopFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "pickup",
      address: initialData?.address || "",
      time: initialData?.time || "",
      organization: initialData?.organization || "",
      contactName: initialData?.contactName || "",
      contactPhone: initialData?.contactPhone || "",
    },
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        type: initialData.type,
        address: initialData.address,
        time: initialData.time || "",
        organization: initialData.organization || "",
        contactName: initialData.contactName || "",
        contactPhone: initialData.contactPhone || "",
      });
    }
  }, [initialData, form]);

  const stopType = form.watch("type");
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      const stop: Stop = {
        id: initialData?.id || Date.now(), // Use existing ID if editing, or timestamp for new
        name: values.name,
        type: values.type,
        address: values.address,
        time: values.time,
        organization: values.organization,
        contactName: values.contactName,
        contactPhone: values.contactPhone,
      };
      onSubmit(stop);
      form.reset();
    } catch (error) {
      console.error("Error adding stop:", error);
      toast({
        title: "Error adding stop",
        description: "There was a problem adding this stop. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddressSelection = (address: string) => {
    form.setValue("address", address);
    setIsMapPickerOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stop Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Pickup Point</SelectItem>
                  <SelectItem value="checkpoint">Checkpoint</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {stopType === "pickup" && (
          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map(org => (
                      <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stop Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter stop name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <div className="flex space-x-2">
                <FormControl className="flex-1">
                  <Input placeholder="Enter address" {...field} />
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  className="shrink-0"
                  onClick={() => setIsMapPickerOpen(true)}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pickup Time</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time">
                    <div className="flex items-center">
                      {field.value && <Clock className="mr-2 h-4 w-4" />}
                      <span>{field.value || "Select time"}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update Stop" : "Add Stop"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
