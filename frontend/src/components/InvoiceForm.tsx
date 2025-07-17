import React, { useState } from "react";

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
    value: string | number
  ) => {
    const newItems = [...lineItems];
    const updatedItem = { ...newItems[index] };

    if (field === "description") {
      updatedItem[field] = value as string;
    } else {
      updatedItem[field] = Number(value) as number;
    }

    newItems[index] = updatedItem;
    setLineItems(newItems);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeLineItem = (index: number) => {
    const newItems = lineItems.filter((_, i) => i !== index);
    setLineItems(newItems);
  };

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const total = subtotal * (1 + tva / 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      freelancer,
      client,
      lineItems,
      tva,
      total,
    };
    console.log("Facture générée :", data);
    // TODO: envoyer au backend
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-4 space-y-4 bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold">Nouvelle facture</h2>

      <input
        className="w-full border p-2 rounded"
        placeholder="Nom du freelance"
        value={freelancer}
        onChange={(e) => setFreelancer(e.target.value)}
        required
      />

      <input
        className="w-full border p-2 rounded"
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
              className="flex-1 border p-2 rounded"
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleItemChange(index, "description", e.target.value)
              }
            />
            <input
              type="number"
              className="w-24 border p-2 rounded"
              placeholder="Quantité"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
            />
            <input
              type="number"
              step="0.01"
              className="w-28 border p-2 rounded"
              placeholder="Prix unitaire"
              value={item.unitPrice}
              onChange={(e) =>
                handleItemChange(index, "unitPrice", e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => removeLineItem(index)}
              className="text-red-600 font-bold"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addLineItem}
          className="text-blue-600 font-semibold"
        >
          + Ajouter une ligne
        </button>
      </div>

      <div className="space-y-2">
        <label className="block">TVA (%)</label>
        <input
          type="number"
          value={tva}
          onChange={(e) => setTva(Number(e.target.value))}
          className="w-24 border p-2 rounded"
        />
      </div>

      <div className="space-y-1">
        <p>Sous-total : {subtotal.toFixed(2)} €</p>
        <p>Total (avec TVA) : {total.toFixed(2)} €</p>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Générer la facture
      </button>
    </form>
  );
}
