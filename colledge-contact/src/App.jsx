import { useEffect, useState } from "react";
import axios from "axios";
import ContactForm from "./components/ContactForm";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverWaking, setServerWaking] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setServerWaking(true);

      const res = await axios.get(`${API}/api/contacts`, {
        timeout: 120000 // 2 min for Render cold start
      });

      setContacts(res.data.data || []);
      setServerWaking(false);
    } catch (err) {
      console.log("Server still starting...");
      setServerWaking(true);
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (data) => {
    await axios.post(`${API}/api/contacts`, data);
    fetchContacts();
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* HEADER */}
        <header className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight">
            Contact Manager
          </h1>
          <p className="text-gray-500 mt-2">
            Full Stack Contact Management App
          </p>
        </header>

        {/* SERVER WAKE MESSAGE */}
        {serverWaking && (
          <div className="max-w-xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-xl text-center shadow-sm">
              <p className="font-medium">
                Server is starting (1–2 minutes). Please wait…
              </p>
              <p className="text-sm mt-1 opacity-80">
                This happens when the server hasn’t been used recently.
              </p>
            </div>
          </div>
        )}

        {/* FORM */}
        <ContactForm onAdd={addContact} />

        {/* CONTACT LIST */}
        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="font-semibold mb-4">
            Saved Contacts ({contacts.length})
          </h2>

          {loading && (
            <p className="text-gray-400 text-sm">Loading contacts…</p>
          )}

          {!loading && contacts.length === 0 && (
            <p className="text-gray-400 text-sm">
              No contacts saved yet.
            </p>
          )}

          {contacts.map((c) => (
            <div
              key={c._id}
              className="py-3 border-b last:border-none"
            >
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-gray-500">
                {c.email} · {c.phone}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
