import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API}/api/contacts`);

      // ✅ CORRECT FOR YOUR BACKEND
      setContacts(res.data.data || []);
      setMeta(res.data.meta || {});

    } catch (err) {
      console.error(err);
      setError("Failed to load contacts");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (form) => {
    await axios.post(`${API}/api/contacts`, form);
    fetchContacts();
  };

  const deleteContact = async (id) => {
    await axios.delete(`${API}/api/contacts/${id}`);
    fetchContacts();
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-5xl font-semibold tracking-tight">
            Contact Manager
          </h1>
          <p className="text-[#6e6e73]">
            Connected to live API
          </p>
        </header>

        {/* Debug (safe to remove later) */}
        <p className="text-xs text-center text-gray-400">
          Loaded contacts: {contacts.length}
        </p>

        <ContactForm onAdd={addContact} />

        <section className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            Contacts ({meta.total})
          </h2>

          {loading && <p className="text-sm text-gray-500">Loading…</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {!loading && contacts.length === 0 && (
            <p className="text-sm text-gray-500">No contacts found.</p>
          )}

          <ul className="divide-y">
            {contacts.map((c) => (
              <li
                key={c._id}
                className="group px-4 py-4 flex justify-between items-start hover:bg-[#f5f5f7] rounded-xl transition"
              >
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-[#6e6e73]">
                    {c.email} · {c.phone}
                  </p>
                  {c.message && (
                    <p className="text-sm italic text-[#6e6e73] mt-1">
                      “{c.message}”
                    </p>
                  )}
                </div>

                <button
                  onClick={() => deleteContact(c._id)}
                  className="opacity-0 group-hover:opacity-100 text-sm text-red-600 hover:underline transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>

      </div>
    </div>
  );
}

/* ---------------- COMPONENT ---------------- */

function ContactForm({ onAdd }) {
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

      {["name", "email", "phone"].map((f) => (
        <input
          key={f}
          placeholder={f[0].toUpperCase() + f.slice(1)}
          value={form[f]}
          onChange={(e) =>
            setForm({ ...form, [f]: e.target.value })
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
        className="w-full rounded-xl bg-[#f5f5f7] px-4 py-3 resize-none outline-none"
      />

      <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">
        Save Contact
      </button>
    </form>
  );
}
