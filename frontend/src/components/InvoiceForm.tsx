import React, { useState, ChangeEvent, FormEvent } from "react";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function InvoiceForm() {
  const [freelancer, setFreelancer] = useState("");
  const [client, setClient] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [tva, setTva] = useState(20);

  const handleItemChange = (
    index: number,
    field: keyof LineItem,
    value: string
  ) => {
    const updatedItems = [...lineItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === "description" ? value : Number(value),
    };
    setLineItems(updatedItems);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const total = subtotal * (1 + tva / 100);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = { freelancer, client, lineItems, tva, total };
    console.log("Facture générée :", data);
    // TODO : envoyer au backend
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-4 space-y-4 bg-zinc-900 text-white"
    >
      <h2 className="text-xl font-bold">Nouvelle facture</h2>

      <input
        className="w-full border p-2 rounded bg-zinc-800"
        placeholder="Nom du freelance"
        value={freelancer}
        onChange={(e) => setFreelancer(e.target.value)}
        required
      />

      <input
        className="w-full border p-2 rounded bg-zinc-800"
        placeholder="Nom du client"
        value={client}
        onChange={(e) => setClient(e.target.value)}
        required
      />

      <div className="space-y-2">
        <h3 className="font-semibold">Prestations</h3>
        {lineItems.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              className="flex-1 border p-2 rounded bg-zinc-800"
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleItemChange(index, "description", e.target.value)
              }
            />
            <input
              type="number"
              className="w-24 border p-2 rounded bg-zinc-800"
              placeholder="Quantité"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              step="1"
              min="1"
            />
            <input
              type="number"
              className="w-28 border p-2 rounded bg-zinc-800"
              placeholder="Prix unitaire"
              value={item.unitPrice}
              onChange={(e) =>
                handleItemChange(index, "unitPrice", e.target.value)
              }
              step="0.01"
              min="0"
            />
            <button
              type="button"
              onClick={() => removeLineItem(index)}
              className="text-red-500 font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addLineItem}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        + Ajouter une prestation
      </button>

      <div className="pt-4">
        <label className="block mb-1">TVA (%)</label>
        <input
          type="number"
          value={tva}
          onChange={(e) => setTva(Number(e.target.value))}
          className="w-24 border p-2 rounded bg-zinc-800"
        />
      </div>

      <div className="pt-4">
        <p className="text-lg">Total HT : {subtotal.toFixed(2)} €</p>
        <p className="text-lg font-semibold">
          Total TTC : {total.toFixed(2)} €
        </p>
      </div>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
      >
        Générer la facture
      </button>
    </form>
  );
}
