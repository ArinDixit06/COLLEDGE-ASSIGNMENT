import { useState } from "react";

export default function ContactForm({ onAdd }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;
    onAdd(form);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-3xl shadow-lg p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold">Add Contact</h2>

      {["name", "email", "phone"].map((field) => (
        <input
          key={field}
          placeholder={field[0].toUpperCase() + field.slice(1)}
          value={form[field]}
          onChange={(e) =>
            setForm({ ...form, [field]: e.target.value })
          }
          className="w-full rounded-xl bg-[#f5f5f7] px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      ))}

      <textarea
        placeholder="Message (optional)"
        value={form.message}
        onChange={(e) =>
          setForm({ ...form, message: e.target.value })
        }
        rows={3}
        className="w-full rounded-xl bg-[#f5f5f7] px-4 py-3 outline-none resize-none"
      />

      <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">
        Add Contact
      </button>
    </form>
  );
}
