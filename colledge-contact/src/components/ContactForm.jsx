import { useState } from "react";

const emailRegex = /^\S+@\S+\.\S+$/;
const phoneRegex = /^\d{10}$/;

export default function ContactForm({ onAdd }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false
  });

  // -------- VALIDATION --------
  const nameInvalid = touched.name && form.name.trim().length < 2;
  const emailInvalid = touched.email && !emailRegex.test(form.email);
  const phoneInvalid = touched.phone && !phoneRegex.test(form.phone);

  const isFormValid =
    !nameInvalid &&
    !emailInvalid &&
    !phoneInvalid &&
    form.name &&
    form.email &&
    form.phone;

  // -------- HANDLERS --------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Only digits allowed for phone
    if (name === "phone" && !/^\d*$/.test(value)) return;

    setForm((f) => ({ ...f, [name]: value }));
    setTouched((t) => ({ ...t, [name]: true })); // 👈 validate WHILE typing
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    onAdd(form);
    setForm({ name: "", email: "", phone: "", message: "" });
    setTouched({ name: false, email: false, phone: false });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-lg p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold">Add Contact</h2>

      {/* NAME */}
      <div>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className={`w-full rounded-xl px-4 py-3 bg-[#f5f5f7] outline-none border
            ${nameInvalid ? "border-red-500" : "border-gray-300"}
            focus:ring-2 ${nameInvalid ? "focus:ring-red-200" : "focus:ring-blue-500"}`}
        />
        {nameInvalid && (
          <p className="text-sm text-red-500 mt-1">
            Name must be at least 2 characters
          </p>
        )}
      </div>

      {/* EMAIL */}
      <div>
        <input
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className={`w-full rounded-xl px-4 py-3 bg-[#f5f5f7] outline-none border
            ${emailInvalid ? "border-red-500" : "border-gray-300"}
            focus:ring-2 ${emailInvalid ? "focus:ring-red-200" : "focus:ring-blue-500"}`}
        />
        {emailInvalid && (
          <p className="text-sm text-red-500 mt-1">
            Invalid email format
          </p>
        )}
      </div>

      {/* PHONE */}
      <div>
        <input
          name="phone"
          placeholder="10-digit Phone Number"
          value={form.phone}
          onChange={handleChange}
          maxLength={10}
          className={`w-full rounded-xl px-4 py-3 bg-[#f5f5f7] outline-none border
            ${phoneInvalid ? "border-red-500" : "border-gray-300"}
            focus:ring-2 ${phoneInvalid ? "focus:ring-red-200" : "focus:ring-blue-500"}`}
        />
        {phoneInvalid && (
          <p className="text-sm text-red-500 mt-1">
            Invalid phone number (10 digits required)
          </p>
        )}
      </div>

      {/* MESSAGE */}
      <textarea
        name="message"
        placeholder="Message (optional)"
        value={form.message}
        onChange={handleChange}
        rows={3}
        className="w-full rounded-xl px-4 py-3 bg-[#f5f5f7] outline-none resize-none border border-gray-300 focus:ring-2 focus:ring-blue-500"
      />

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={!isFormValid}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium transition
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   hover:bg-blue-700 active:scale-95"
      >
        Save Contact
      </button>
    </form>
  );
}
