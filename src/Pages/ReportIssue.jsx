import {
  AlertCircle,
  CheckCircle,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Upload,
  MapPin,
} from "lucide-react";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import csrfManager from "../utils/csrfManager";
import jsPDF from "jspdf";

const BackgroundElements = React.memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-green-200/20 to-emerald-300/10 dark:from-green-600/10 dark:to-emerald-400/5 blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-teal-200/20 to-green-300/10 dark:from-teal-600/10 dark:to-green-400/5 blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-100/10 to-green-200/5 dark:from-emerald-600/5 dark:to-green-500/5 blur-3xl animate-pulse delay-500"></div>
    </div>
  );
});
BackgroundElements.displayName = "BackgroundElements";

const FormInput = React.memo(
  ({
    type = "text",
    id,
    label,
    placeholder,
    value,
    onChange,
    required = false,
    rows,
    icon: Icon,
    disabled = false,
    error,
  }) => {
    const [isFocused, setIsFocused] = useState(false);
    const InputComponent = type === "textarea" ? "textarea" : "input";

    return (
      <div className="group mb-4">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          {label}
          {required && (
            <span className="text-red-400 dark:text-red-400 ml-1">*</span>
          )}
        </label>
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isFocused
                    ? "text-green-500 dark:text-green-400"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              />
            </div>
          )}
          <InputComponent
            type={type !== "textarea" ? type : undefined}
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={rows}
            disabled={disabled}
            className={`w-full rounded-xl border-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm transition-all duration-200 ease-out
              ${Icon ? "pl-11" : "pl-4"} pr-4 py-3.5
              ${
                error
                  ? "border-red-400 dark:border-red-500 ring-4 ring-red-100 dark:ring-red-900/50"
                  : isFocused
                  ? "border-green-300 dark:border-green-500 ring-4 ring-green-100 dark:ring-green-900/50"
                  : "border-slate-200 dark:border-slate-600 hover:border-green-200 dark:hover:border-green-500"
              }
              ${disabled ? "opacity-60 cursor-not-allowed" : ""}
              placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-200
              focus:outline-none
              ${type === "textarea" ? "resize-y min-h-[120px]" : ""}
            `}
            required={required}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {error}
          </p>
        )}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

const LoadingSpinner = () => (
  <div className="inline-flex items-center">
    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
    Submitting...
  </div>
);

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    title: "",
    description: "",
    notifyByEmail: false,
    location: "",
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  const [errors, setErrors] = useState({});

  // validation logic
  const validateForm = useCallback(() => {
    let newErrors = {};

    if (!/^\+?[0-9]{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number.";
    }
    if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.title.trim()) {
      newErrors.title = "Issue title is required.";
    }
    if (!formData.description.trim() || formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback(
    (field) => (e) => {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: null })); // clear error while typing
    },
    []
  );

  const handleFileChange = useCallback((e) => {
    setFile(e.target.files[0]);
  }, []);

  const downloadReceipt = useCallback((data) => {
    try {
      const doc = new jsPDF();
      const now = new Date();
      doc.setFontSize(18);
      doc.text("Issue Report Receipt", 15, 20);
      doc.setFontSize(12);
      doc.text(`Date: ${now.toLocaleString()}`, 15, 30);
      doc.text("Submitted Details:", 15, 40);
      let y = 50;
      doc.text(`Phone: ${data.phone}`, 15, y);
      y += 10;
      doc.text(`Email: ${data.email}`, 15, y);
      y += 10;
      doc.text(`Title: ${data.title}`, 15, y);
      y += 10;
      doc.text("Description:", 15, y);
      y += 8;
      const descLines = doc.splitTextToSize(data.description || "", 180);
      doc.text(descLines, 20, y);
      y += descLines.length * 8 + 2;
      doc.text(`Location: ${data.location}`, 15, y);
      doc.save("issue_receipt.pdf");
    } catch (pdfErr) {
      console.error("PDF generation error:", pdfErr);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (isSubmitting) return;

      if (!validateForm()) {
        setSubmitStatus("error");
        return;
      }

      setIsSubmitting(true);
      setSubmitStatus("success");
      setSubmittedData({ ...formData });

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (file) formDataToSend.append("file", file);

      try {
        const response = await csrfManager.secureFetch("/api/issues", {
          method: "POST",
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Issue submitted successfully:", result);

        setFormData({
          phone: "",
          email: "",
          title: "",
          description: "",
          notifyByEmail: false,
          location: "",
        });
        setFile(null);

        downloadReceipt(formData);

        setTimeout(() => setSubmitStatus(null), 5000);
      } catch (err) {
        console.error("Submit error:", err);
        if (err.message.includes("CSRF") || err.message.includes("403")) {
          csrfManager.clearToken();
        }
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, file, isSubmitting, validateForm, downloadReceipt]
  );

  const formFields = useMemo(
    () => [
      {
        id: "phone",
        type: "tel",
        label: "Phone Number",
        placeholder: "+91 98765 43210",
        required: true,
        icon: Phone,
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "you@example.com",
        required: true,
        icon: Mail,
      },
      {
        id: "title",
        type: "text",
        label: "Issue Title",
        placeholder: "Brief description of the issue",
        required: true,
        icon: FileText,
      },
      {
        id: "description",
        type: "textarea",
        label: "Detailed Description",
        placeholder:
          "Please provide comprehensive details about the issue. Include steps to reproduce, expected vs actual behavior, and any error messages.",
        rows: 4,
        required: true,
        icon: MessageSquare,
      },
      {
        id: "location",
        type: "text",
        label: "Location",
        placeholder: "Detecting your current location...",
        required: true,
        icon: MapPin,
      },
    ],
    []
  );

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setFormData((prev) => ({
            ...prev,
            location: data.display_name || `${latitude}, ${longitude}`,
          }));
        } catch (err) {
          setFormData((prev) => ({
            ...prev,
            location: `${latitude}, ${longitude}`,
          }));
        }
      },
      (err) => console.warn("Geolocation error:", err.message)
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 relative">
      <BackgroundElements />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Report an Issue
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Help us improve by reporting any problems you've encountered.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-xl border p-8 relative overflow-hidden"
        >
          <div className="space-y-6">
            {formFields.map((field) => (
              <FormInput
                key={field.id}
                {...field}
                value={formData[field.id]}
                onChange={handleInputChange(field.id)}
                disabled={isSubmitting}
                error={errors[field.id]}
              />
            ))}

            <div className="group">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Attach Screenshot or File{" "}
                <span className="text-slate-400">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center ${
                    file
                      ? "border-green-300 bg-green-50/50"
                      : "border-slate-300 hover:border-green-300 hover:bg-green-50/30"
                  } ${isSubmitting ? "opacity-60" : ""}`}
                >
                  <Upload
                    className={`w-8 h-8 mx-auto mb-2 ${
                      file ? "text-green-500" : "text-slate-400"
                    }`}
                  />
                  <p className="text-sm font-medium">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white shadow-lg transition-all ${
                isSubmitting
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? <LoadingSpinner /> : "Submit Report"}
            </button>

            {submitStatus === "success" && (
              <div className="flex items-center justify-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Report submitted successfully!</span>
              </div>
            )}
            {submitStatus === "error" && (
              <div className="flex items-center justify-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>Failed to submit. Please check errors.</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
