"use client";

import { useState, useRef, useEffect } from "react";
import { useCurrentUser, useUpdateProfile } from "@/modules/user/hook";
import type {
  IUpdateUserPayload,
  IAllergy,
  IMedicalCondition,
  IInjury,
} from "@/modules/user/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Loader2, Camera, Plus, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SettingPage() {
  const { data: user, isLoading } = useCurrentUser();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "male" as "male" | "female" | "other",
  });

  // Lifestyle toggles
  const [lifestyle, setLifestyle] = useState({
    alcohol: false,
    smoking: false,
    caffeine: false,
    fasting: false,
  });

  // Health Data
  const [medicalConditions, setMedicalConditions] = useState<
    IMedicalCondition[]
  >([]);
  const [allergies, setAllergies] = useState<IAllergy[]>([]);
  const [injuries, setInjuries] = useState<IInjury[]>([]);

  // New item inputs
  const [newCondition, setNewCondition] = useState("");
  const [newAllergy, setNewAllergy] = useState({ name: "", severity: "" });
  const [newInjury, setNewInjury] = useState({ name: "", year: "", notes: "" });

  useEffect(() => {
    setMounted(true);
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        age: user.age?.toString() || "",
        gender: user.gender || "male",
      });
      setLifestyle({
        alcohol: user.lifestyle?.alcohol || false,
        smoking: user.lifestyle?.smoking || false,
        caffeine: user.lifestyle?.caffeine || false,
        fasting: user.lifestyle?.fasting || false,
      });
      setMedicalConditions(user.medicalConditions || []);
      setAllergies(user.allergies || []);
      setInjuries(user.pastInjuries || []);
    }
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await updateProfile({ payload: {}, imageFile: file });
      toast.success("Profile picture updated");
    } catch {
      toast.error("Failed to update profile picture");
    }
  };

  const handleSave = async () => {
    try {
      const payload: IUpdateUserPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        age: formData.age ? Number(formData.age) : undefined,
        gender: formData.gender,
        lifestyle,
        medicalConditions,
        allergies,
        pastInjuries: injuries,
      };

      await updateProfile({ payload });
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const addCondition = () => {
    if (!newCondition.trim()) return;
    setMedicalConditions([...medicalConditions, { name: newCondition }]);
    setNewCondition("");
  };

  const addAllergy = () => {
    if (!newAllergy.name.trim()) return;
    setAllergies([...allergies, newAllergy]);
    setNewAllergy({ name: "", severity: "" });
  };

  const addInjury = () => {
    if (!newInjury.name?.trim()) return;
    setInjuries([
      ...injuries,
      {
        name: newInjury.name,
        year: newInjury.year ? Number(newInjury.year) : undefined,
        notes: newInjury.notes,
      },
    ]);
    setNewInjury({ name: "", year: "", notes: "" });
  };

  if (isLoading || !mounted) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Please login to view settings</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Panel - Profile Card */}
      <div className="lg:col-span-3">
        <div className="bg-card/50 rounded-xl border border-border/50 p-6">
          {/* Profile Picture */}
          <div className="relative mx-auto w-32 h-32 mb-4">
            <div className="w-full h-full rounded-full bg-muted overflow-hidden border-4 border-primary/20">
              {user.image ? (
                <Image
                  src={user.image}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground bg-muted">
                  {user.name?.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
              className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Pencil className="w-3 h-3" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Quick Info */}
          <div className="text-center mb-6">
            <h3 className="font-semibold text-lg text-foreground">
              {user.name}
            </h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          {/* Stats */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Age:</span>
              <span className="font-medium text-foreground">
                {user.age || "Not set"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Gender:</span>
              <span className="font-medium text-foreground capitalize">
                {user.gender || "Not set"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Role:</span>
              <span className="font-medium text-foreground capitalize">
                {user.role}
              </span>
            </div>
          </div>

          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full mt-6"
          >
            <Camera className="w-4 h-4 mr-2" />
            Change Photo
          </Button>
        </div>
      </div>

      {/* Center Panel - Account Details */}
      <div className="lg:col-span-4">
        <div className="bg-card/50 rounded-xl border border-border/50 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Account Details
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <div className="flex gap-2">
                {(["male", "female", "other"] as const).map((gender) => (
                  <Button
                    key={gender}
                    type="button"
                    variant={formData.gender === gender ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, gender })}
                    className="capitalize flex-1"
                  >
                    {gender}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lifestyle</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["alcohol", "smoking", "caffeine", "fasting"] as const).map(
                  (item) => (
                    <Button
                      key={item}
                      variant={lifestyle[item] ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setLifestyle({ ...lifestyle, [item]: !lifestyle[item] })
                      }
                      className="capitalize"
                    >
                      {item}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={isPending}
            className="w-full mt-6"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Right Panel - Health Information */}
      <div className="lg:col-span-5">
        <div className="bg-card/50 rounded-xl border border-border/50 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">
            Health Information
          </h2>

          {/* Medical Conditions */}
          <div className="space-y-3">
            <Label>Medical Conditions</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Diabetes, Hypertension"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCondition()}
                className="bg-background/50"
              />
              <Button size="sm" onClick={addCondition}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {medicalConditions.map((condition, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                >
                  {condition.name}
                  <button
                    onClick={() =>
                      setMedicalConditions(
                        medicalConditions.filter((_, i) => i !== idx)
                      )
                    }
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="space-y-3">
            <Label>Allergies</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Allergy name"
                value={newAllergy.name}
                onChange={(e) =>
                  setNewAllergy({ ...newAllergy, name: e.target.value })
                }
                className="bg-background/50"
              />
              <Input
                placeholder="Severity"
                value={newAllergy.severity}
                onChange={(e) =>
                  setNewAllergy({ ...newAllergy, severity: e.target.value })
                }
                className="bg-background/50 w-24"
              />
              <Button size="sm" onClick={addAllergy}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {allergies.map((allergy, idx) => (
                <span
                  key={idx}
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm",
                    allergy.severity?.toLowerCase() === "high"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-yellow-500/10 text-yellow-500"
                  )}
                >
                  {allergy.name}
                  {allergy.severity && (
                    <span className="text-xs">({allergy.severity})</span>
                  )}
                  <button
                    onClick={() =>
                      setAllergies(allergies.filter((_, i) => i !== idx))
                    }
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Past Injuries */}
          <div className="space-y-3">
            <Label>Past Injuries</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Injury name"
                value={newInjury.name}
                onChange={(e) =>
                  setNewInjury({ ...newInjury, name: e.target.value })
                }
                className="bg-background/50"
              />
              <Input
                placeholder="Year"
                type="number"
                value={newInjury.year}
                onChange={(e) =>
                  setNewInjury({ ...newInjury, year: e.target.value })
                }
                className="bg-background/50 w-20"
              />
              <Button size="sm" onClick={addInjury}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <Textarea
              placeholder="Notes about the injury..."
              value={newInjury.notes}
              onChange={(e) =>
                setNewInjury({ ...newInjury, notes: e.target.value })
              }
              className="bg-background/50"
              rows={2}
            />
            <div className="space-y-2">
              {injuries.map((injury, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-3 rounded-lg bg-muted/30 border border-border/30"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {injury.name}{" "}
                      {injury.year && (
                        <span className="text-muted-foreground">
                          ({injury.year})
                        </span>
                      )}
                    </p>
                    {injury.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {injury.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setInjuries(injuries.filter((_, i) => i !== idx))
                    }
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
