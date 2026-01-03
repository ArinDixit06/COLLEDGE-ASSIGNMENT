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

  const nameInvalid = touched.name && form.name.trim().length < 2;
  const emailInvalid = touched.email && !emailRegex.test(form.email);
  const phoneInvalid = touched.phone && !phoneRegex.test(form.phone);

  const isValid =
    !nameInvalid &&
    !emailInvalid &&
    !phoneInvalid &&
    form.name &&
    form.email &&
    form.phone;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && !/^\d*$/.test(value)) return;

    setForm((f) => ({ ...f, [name]: value }));
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    onAdd(form);
    setForm({ name: "", email: "", phone: "", message: "" });
    setTouched({ name: false, email: false, phone: false });
  };

  const base =
    "w-full rounded-xl px-4 py-3 bg-[#f5f5f7] outline-none border transition";

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-3xl shadow p-6 space-y-4"
    >
      <h2 className="font-semibold text-lg">Add Contact</h2>

      {/* NAME */}
      <div>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className={`${base} ${
            nameInvalid
              ? "border-red-500 focus-visible:border-red-500"
              : "border-gray-300 focus-visible:border-blue-500"
          }`}
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
          className={`${base} ${
            emailInvalid
              ? "border-red-500 focus-visible:border-red-500"
              : "border-gray-300 focus-visible:border-blue-500"
          }`}
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
          className={`${base} ${
            phoneInvalid
              ? "border-red-500 focus-visible:border-red-500"
              : "border-gray-300 focus-visible:border-blue-500"
          }`}
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
        className={`${base} border-gray-300 focus-visible:border-blue-500 resize-none`}
      />

      <button
        disabled={!isValid}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium
                   hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Save Contact
      </button>
    </form>
  );
}
