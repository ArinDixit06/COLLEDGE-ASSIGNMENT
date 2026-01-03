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

  // -------- VALIDATION LOGIC --------
  const errors = {
    name:
      touched.name && form.name.trim().length < 2
        ? "Name must be at least 2 characters"
        : "",
    email:
      touched.email && !emailRegex.test(form.email)
        ? "Enter a valid email address"
        : "",
    phone:
      touched.phone && !phoneRegex.test(form.phone)
        ? "Phone number must be exactly 10 digits"
        : ""
  };

  const isFormValid =
    form.name.trim().length >= 2 &&
    emailRegex.test(form.email) &&
    phoneRegex.test(form.phone);

  // -------- HANDLERS --------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only digits for phone
    if (name === "phone" && !/^\d*$/.test(value)) return;

    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    onAdd(form);
    setForm({ name: "", email: "", phone: "", message: "" });
    setTouched({ name: false, email: false, phone: false });
  };

  // -------- UI --------
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
          onBlur={handleBlur}
          className={`w-full rounded-xl px-4 py-3 bg-[#f5f5f7] outline-none focus:ring-2 ${
            errors.name
              ? "border border-red-500 focus:ring-red-200"
              : "focus:ring-blue-500"
          }`}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name}</p>
        )}
      </div>

      {/* EMAIL */}
      <div>
        <input
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full rounded-xl px-4 py-3 bg-[#f5f5f7] outline-none focus:ring-2 ${
            errors.email
              ? "border border-red-500 focus:ring-red-200"
              : "focus:ring-blue-500"
          }`}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      {/* PHONE */}
      <div>
        <input
          name="phone"
          placeholder="10-digit Phone Number"
          value={form.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={10}
          className={`w-full rounded-xl px-4 py-3 bg-[#f5f5f7] outline-none focus:ring-2 ${
            errors.phone
              ? "border border-red-500 focus:ring-red-200"
              : "focus:ring-blue-500"
          }`}
        />
        {errors.phone && (
          <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
        )}
      </div>

      {/* MESSAGE */}
      <textarea
        name="message"
        placeholder="Message (optional)"
        value={form.message}
        onChange={handleChange}
        rows={3}
        className="w-full rounded-xl px-4 py-3 bg-[#f5f5f7] outline-none resize-none focus:ring-2 focus:ring-blue-500"
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
