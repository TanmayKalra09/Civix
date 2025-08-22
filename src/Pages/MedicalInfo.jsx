// pages/MedicalInfo.jsx
import { ArrowLeft, Phone, Hospital, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const demo = {
  name: "Aarav Sharma",
  age: 24,
  blood: "B+",
  allergies: ["Peanuts", "Penicillin"],
  meds: ["Cetirizine (SOS)"],
  conditions: ["Mild Asthma"],
  doctor: { name: "Dr. Verma", phone: "+91111222333", hospital: "CityCare Hospital" },
  contacts: [
    { name: "Mom", phone: "+919999888877" },
    { name: "Best Friend", phone: "+919876543210" },
  ],
};

export default function MedicalInfo() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-slate-700 hover:text-black"
      >
        <ArrowLeft /> Back
      </button>

      <h1 className="text-2xl font-bold">Medical Information</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border bg-white p-6">
            <h3 className="font-semibold text-xl">{demo.name}</h3>
            <p className="text-slate-600">Age {demo.age} • Blood Group {demo.blood}</p>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <Card title="Allergies" items={demo.allergies} />
              <Card title="Medications" items={demo.meds} />
              <Card title="Conditions" items={demo.conditions} />
              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="text-emerald-600" /> Insurance (optional)
                </div>
                <p className="text-sm text-slate-600 mt-1">Add provider, ID, and emergency notes.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <div className="flex items-center gap-3 font-semibold">
              <Hospital className="text-rose-600" />
              Primary Doctor
            </div>
            <p className="mt-2">{demo.doctor.name}</p>
            <p className="text-slate-600">{demo.doctor.hospital}</p>
            <a href={`tel:${demo.doctor.phone}`} className="inline-flex items-center gap-2 mt-3 text-indigo-600 hover:underline">
              <Phone className="w-4 h-4" /> Call Doctor
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6">
            <h4 className="font-semibold mb-3">Emergency Contacts</h4>
            <ul className="space-y-3">
              {demo.contacts.map((c, i) => (
                <li key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-slate-600">{c.phone}</p>
                  </div>
                  <a className="px-3 py-1.5 rounded-lg border hover:bg-slate-50" href={`tel:${c.phone}`}>
                    Call
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border bg-white p-6 text-center">
            <p className="text-sm text-slate-600 mb-3">
              QR for first responders (placeholder)
            </p>
            <div className="mx-auto h-40 w-40 bg-slate-200 rounded-lg" />
            <button className="mt-4 px-3 py-2 rounded-lg border hover:bg-slate-50">
              Download QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, items }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="font-semibold">{title}</p>
      <ul className="mt-2 list-disc ml-5 text-sm text-slate-700 space-y-1">
        {items.map((x, i) => <li key={i}>{x}</li>)}
      </ul>
    </div>
  );
}
