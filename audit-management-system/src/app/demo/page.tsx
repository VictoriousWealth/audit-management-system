"use client";
import { useState } from "react";

export default function DemoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    goals: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Demo request:", formData);
    alert("Thank you — we’ll reach out shortly to arrange your personalized demo.");
    setFormData({ name: "", email: "", company: "", role: "", goals: "" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 py-16 transition-colors duration-300">
      <div className="max-w-2xl w-full bg-surface p-10 rounded-2xl shadow-subtle border border-border hover:shadow-lg hover:border-accent/70 transition-all duration-300">
        <h1 className="text-4xl font-semibold text-primary mb-6 text-center">
          Request a Demo
        </h1>

        <p className="text-text-secondary text-center mb-10 leading-relaxed">
          Experience how{" "}
          <span className="text-accent font-medium">CleanAudits</span>{" "}
          simplifies audit tracking and compliance for modern pharma teams.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: "Full Name", name: "name", type: "text", required: true },
            { label: "Company", name: "company", type: "text" },
            { label: "Role / Position", name: "role", type: "text" },
            { label: "Email Address", name: "email", type: "email", required: true },
          ].map(({ label, name, type, required }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {label}
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
              What would you like to learn in the demo?
            </label>
            <textarea
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              rows={4}
              placeholder="e.g., Automating CAPA tracking or improving audit readiness"
              className="w-full border border-border rounded-lg px-3 py-2.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-surface font-medium py-3 rounded-lg hover:bg-accent hover:text-background transition-all duration-300"
          >
            Submit Request
          </button>
        </form>
      </div>
    </main>
  );
}
