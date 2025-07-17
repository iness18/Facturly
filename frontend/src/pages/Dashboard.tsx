import InvoiceForm from "../components/InvoiceForm";

export default function Dashboard() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">Nouvelle facture</h2>
      <InvoiceForm />
    </div>
  );
}
