"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    goals: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const trimmed = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      company: formData.company.trim(),
      role: formData.role.trim(),
      goals: formData.goals.trim(),
    };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed.email)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }

    if (!trimmed.name || !trimmed.company || !trimmed.role || !trimmed.goals) {
      setStatus("error");
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("/api/qna-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trimmed),
      });

      if (!response.ok) {
        const { error: serverError } = await response.json();
        setStatus("error");
        setError(serverError || "Failed to submit consultation request");
        return;
      }

      setStatus("success");
      setFormData({ name: "", email: "", company: "", role: "", goals: "" });
      router.push("/contact/success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError("Could not send your request right now. Please try again.");
    } finally {
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="bg-background text-foreground flex flex-col items-center justify-center px-6 py-16 transition-colors duration-300 w-full">
      <div className="max-w-2xl w-full bg-surface p-10 rounded-2xl shadow-subtle border border-border hover:shadow-lg hover:border-accent/70 transition-all duration-300">
        <h1 className="text-4xl font-semibold text-primary mb-6 text-center">
          Schedule a Consultation
        </h1>

        <p className="text-text-secondary text-center mb-10 leading-relaxed">
          Discover how{" "}
          <span className="text-accent font-medium">CleanAudits</span>{" "}
          can elevate your compliance workflow with precision and trust.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: "Full Name", name: "name", type: "text", required: true },
            { label: "Company", name: "company", type: "text", required: true },
            { label: "Role / Position", name: "role", type: "text", required: true },
            { label: "Email Address", name: "email", type: "email", required: true },
          ].map(({ label, name, type, required }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                <span>{label}</span>
                {required && <span className="text-error">*</span>}
                {!required && <span> (Optional)</span>}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                required={required}
                className="w-full border border-border rounded-lg px-3 py-2.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              What would you like to cover in your consultation?
              <span className="text-error">*</span>
            </label>
            <textarea
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Tell us about your audit management goals..."
              className="w-full border border-border rounded-lg px-3 py-2.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
          </div>

          {status === "success" && (
            <p className="text-success text-sm text-center">
              Thanks! We’ll contact you soon to schedule your live Q&A consultation.
            </p>
          )}
          {status === "error" && error && (
            <p className="text-error text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-primary text-surface font-medium py-3 rounded-lg hover:bg-accent hover:text-background transition-all duration-300"
          >
            {status === "loading" ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
