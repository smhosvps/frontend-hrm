/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useAddUserMutation,
  useGetAllUsersQuery,
} from "@/redux/features/user/userApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Options for dropdowns
const roleOptions = [
  { value: "pastor", label: "Pastor" },
  { value: "Super Admin", label: "Super Admin" },
  { value: "admin staff", label: "Admin Staff" },
  { value: "operatives", label: "Operatives" },
  { value: "adhoc", label: "Adhoc" },
];

const departmentOptions = [
  "Finance",
  "Follow Up",
  "Store",
  "IT",
  "HR",
  "Media",
  "Protocol",
  "Ushering",
  "Children's Church",
  "Teenagers Church",
  "Intercessory",
  "Sanctuary",
  "Technical",
  "Welfare",
  "Transport",
  "Medical",
  "Counseling",
  "Security",
  "Cleaning",
  "Others",
];

const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];

const genderOptions = ["Male", "Female"];

const nigeriaStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export default function AddAccount() {
  const { refetch } = useGetAllUsersQuery({});
  const navigate = useNavigate();
  const [addUser, { isLoading }] = useAddUserMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    password: "",
    phone_Number: "",
    role: "",
    department: "",
    year_of_employment: "",
    marital_status: "",
    state_of_origin: "",
    Local_of_origin: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    country: "Nigeria",
    church_branch: "",
    bio: "",
    cv_link: "",
  });

  const validateForm = () => {
    // Required fields check
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "phone_Number",
      "role",
      "department",
      "year_of_employment",
      "marital_status",
      "state_of_origin",
      "Local_of_origin",
      "dateOfBirth",
      "gender",
      "address",
    ];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]?.toString().trim()) {
        toast.error(`${field.replace(/_/g, " ")} is required`);
        return false;
      }
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }

    // Password length
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    // Phone number format (E.164 recommended)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formData.phone_Number)) {
      toast.error(
        "Phone number must be in E.164 format (e.g., +2348123456789)"
      );
      return false;
    }

    // Date of birth validation
    const dob = new Date(formData.dateOfBirth);
    const today = new Date();

    // Check if date is valid
    if (isNaN(dob.getTime())) {
      toast.error("Invalid date of birth");
      return false;
    }

    // Check if date is in the future
    if (dob > today) {
      toast.error("Date of birth cannot be in the future");
      return false;
    }

    // Calculate age (must be at least 18)
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (age < 18) {
      toast.error("User must be at least 18 years old");
      return false;
    }

    return true;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await addUser(formData).unwrap();
      toast.success("User created successfully");
      refetch();
      navigate("/dashboard/manage-user");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create user");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto p-0 py-4 lg:px-8">
      <Card className="border-blue-100 bg-white/80">
        <CardHeader className="border-b border-blue-100">
          <CardTitle className="text-xl text-blue-600">Add New User</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) => handleChange("middleName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_Number">
                    Phone Number * (E.164 format)
                  </Label>
                  <Input
                    id="phone_Number"
                    value={formData.phone_Number}
                    onChange={(e) =>
                      handleChange("phone_Number", e.target.value)
                    }
                    placeholder="+2348123456789"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password * (min 6 chars)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleChange("gender", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {genderOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 18 years old</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marital_status">Marital Status *</Label>
                  <Select
                    value={formData.marital_status}
                    onValueChange={(value) =>
                      handleChange("marital_status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {maritalStatusOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Work Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleChange("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {roleOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleChange("department", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {departmentOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year_of_employment">
                    Year of Employment *
                  </Label>
                  <Input
                    id="year_of_employment"
                    type="month"
                    value={formData.year_of_employment}
                    onChange={(e) =>
                      handleChange("year_of_employment", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="church_branch">Church Branch</Label>
                  <Input
                    id="church_branch"
                    value={formData.church_branch}
                    onChange={(e) =>
                      handleChange("church_branch", e.target.value)
                    }
                    placeholder="e.g., Headquarters"
                  />
                </div>
              </div>
            </div>

            {/* Location & Origin */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Location & Origin
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state_of_origin">State of Origin *</Label>
                  <Select
                    value={formData.state_of_origin}
                    onValueChange={(value) =>
                      handleChange("state_of_origin", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {nigeriaStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Local_of_origin">LGA *</Label>
                  <Input
                    id="Local_of_origin"
                    value={formData.Local_of_origin}
                    onChange={(e) =>
                      handleChange("Local_of_origin", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Residential Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                  // disabled
                  />
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cv_link">CV Link</Label>
                  <Input
                    id="cv_link"
                    value={formData.cv_link}
                    onChange={(e) => handleChange("cv_link", e.target.value)}
                    placeholder="https://example.com/cv.pdf"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/manage-user")}
                className=" rounded-[6px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 rounded-[6px] text-white"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create User
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
