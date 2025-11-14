"use client";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you — our team will contact you shortly for your consultation.");
    setFormData({ name: "", email: "", company: "", message: "" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 py-16 transition-colors duration-300">
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
            { label: "Company", name: "company", type: "text" },
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
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us about your audit management goals..."
              className="w-full border border-border rounded-lg px-3 py-2.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-surface font-medium py-3 rounded-lg hover:bg-accent hover:text-background transition-all duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
