import React, { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Save, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CollectionSettings = () => {
  // State for collection settings
  const [collectRegistered, setCollectRegistered] = useState(true);
  const [collectUnregistered, setCollectUnregistered] = useState(true);
  const [defaultSampleType, setDefaultSampleType] = useState("registered");

  // State for mandatory settings
  const [mandatorySampleCount, setMandatorySampleCount] = useState(false);
  const [mandatoryAttachments, setMandatoryAttachments] = useState(false);
  const [mandatoryNotes, setMandatoryNotes] = useState(false);
  const [mandatoryRegisteredSample, setMandatoryRegisteredSample] = useState(false);

  // Handle save settings
  const handleSaveSettings = () => {
    // In a real app, this would save to backend/localStorage
    // For now, we'll just show a toast notification
    toast({
      title: "Settings Saved",
      description: `Collection settings updated successfully.`,
    });

    console.log("Saved settings:", {
      collectRegistered,
      collectUnregistered,
      defaultSampleType,
      mandatorySampleCount,
      mandatoryAttachments,
      mandatoryNotes,
      mandatoryRegisteredSample,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">B2B Collection Settings</h1>
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>B2B Collection Settings</CardTitle>
            <CardDescription>
              Configure sample collection types and mandatory field requirements.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Enabling mandatory settings will require users to provide this information before completing pickups or sample collection.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Default Sample Type</h3>
              <RadioGroup
                value={defaultSampleType}
                onValueChange={setDefaultSampleType}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="registered"
                    id="default-registered"
                    disabled={!collectRegistered}
                  />
                  <Label htmlFor="default-registered" className="font-normal">
                    Registered Samples
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="unregistered"
                    id="default-unregistered"
                    disabled={!collectUnregistered}
                  />
                  <Label htmlFor="default-unregistered" className="font-normal">
                    Unregistered Samples
                  </Label>
                </div>
              </RadioGroup>
              <div className="text-xs text-muted-foreground">
                This will be the default selection when adding new samples during collection.
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Registered Sample</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="registered"
                    checked={collectRegistered}
                    onCheckedChange={(checked) => {
                      if (typeof checked === 'boolean') {
                        setCollectRegistered(checked);
                        // If both would be unchecked, force the other one to be checked
                        if (!checked && !collectUnregistered) {
                          setCollectUnregistered(true);
                        }
                      }
                    }}
                  />
                  <Label htmlFor="registered" className="font-normal">
                    Collect Registered Samples
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mandatory-registered-sample"
                    checked={mandatoryRegisteredSample}
                    onCheckedChange={(checked) => {
                      if (typeof checked === 'boolean') {
                        setMandatoryRegisteredSample(checked);
                      }
                    }}
                  />
                  <Label htmlFor="mandatory-registered-sample" className="font-normal">
                    Mandatory Pickup
                  </Label>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Unregistered Sample</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unregistered"
                    checked={collectUnregistered}
                    onCheckedChange={(checked) => {
                      if (typeof checked === 'boolean') {
                        setCollectUnregistered(checked);
                        // If both would be unchecked, force the other one to be checked
                        if (!checked && !collectRegistered) {
                          setCollectRegistered(true);
                        }
                      }
                    }}
                  />
                  <Label htmlFor="unregistered" className="font-normal">
                    Collect Unregistered Samples
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mandatory-sample-count"
                    checked={mandatorySampleCount}
                    onCheckedChange={(checked) => {
                      if (typeof checked === 'boolean') {
                        setMandatorySampleCount(checked);
                      }
                    }}
                  />
                  <Label htmlFor="mandatory-sample-count" className="font-normal">
                    Mandatory Quantity Addition
                  </Label>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Note: At least one sample type must be enabled for collection.
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Other Pickup Location Related</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mandatory-notes"
                    checked={mandatoryNotes}
                    onCheckedChange={(checked) => {
                      if (typeof checked === 'boolean') {
                        setMandatoryNotes(checked);
                      }
                    }}
                  />
                  <Label htmlFor="mandatory-notes" className="font-normal">
                    Mandatory Notes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mandatory-attachments"
                    checked={mandatoryAttachments}
                    onCheckedChange={(checked) => {
                      if (typeof checked === 'boolean') {
                        setMandatoryAttachments(checked);
                      }
                    }}
                  />
                  <Label htmlFor="mandatory-attachments" className="font-normal">
                    Mandatory Attachment
                  </Label>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                When enabled, these requirements must be fulfilled before completing a pickup location.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CollectionSettings;
