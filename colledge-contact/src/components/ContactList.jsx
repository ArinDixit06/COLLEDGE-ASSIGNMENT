import ContactCard from "./ContactCard";

export default function ContactList({ contacts, onDelete }) {
  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <input
          placeholder="Search contacts"
          className="rounded-xl bg-[#f5f5f7] px-4 py-2 text-sm outline-none"
        />

        <select className="rounded-xl bg-[#f5f5f7] px-3 py-2 text-sm">
          <option>Newest</option>
          <option>Oldest</option>
        </select>
      </div>

      {/* List */}
      {contacts.length === 0 ? (
        <p className="text-center text-[#6e6e73] py-10">
          No contacts yet.
        </p>
      ) : (
        <ul className="divide-y">
          {contacts.map((c) => (
            <ContactCard
              key={c._id}
              contact={c}
              onDelete={() => onDelete(c._id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
