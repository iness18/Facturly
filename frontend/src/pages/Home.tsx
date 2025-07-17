import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col">
      <h1 className="text-4xl font-bold mb-4">Bienvenue sur Facturly</h1>
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-indigo-600 rounded hover:bg-indigo-500 transition"
      >
        Créer une facture
      </Link>
    </div>
  );
}
