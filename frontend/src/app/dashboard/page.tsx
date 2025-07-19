"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Users, DollarSign } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalAmount: number;
  totalCount: number;
  pendingCount: number;
}

export default function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalAmount: 0,
    totalCount: 0,
    pendingCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      // Récupérer les factures
      const invoicesResponse = await fetch(`${apiUrl}/invoices`);
      if (!invoicesResponse.ok) {
        throw new Error("Erreur lors de la récupération des factures");
      }
      const invoicesData = await invoicesResponse.json();
      setInvoices(invoicesData);

      // Récupérer les statistiques
      const statsResponse = await fetch(`${apiUrl}/invoices/stats`);
      if (!statsResponse.ok) {
        throw new Error("Erreur lors de la récupération des statistiques");
      }
      const statsData = await statsResponse.json();
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1127] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1127] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">
              Vue d&apos;ensemble de votre activité
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90"
            onClick={() => (window.location.href = "/invoices/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle facture
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
            <p className="text-red-400">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={fetchData}
            >
              Réessayer
            </Button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Chiffre d&apos;affaires total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(stats.totalAmount)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Factures créées
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.totalCount}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Clients actifs
              </CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {new Set(invoices.map((inv) => inv.clientName)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Factures récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  Aucune facture créée pour le moment
                </p>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-blue-500"
                  onClick={() => (window.location.href = "/invoices/new")}
                >
                  Créer votre première facture
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.slice(0, 5).map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/invoices/${invoice.id}`)
                    }
                  >
                    <div>
                      <p className="font-medium text-white">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-sm text-gray-400">
                        {invoice.clientName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">
                        {formatCurrency(invoice.amount)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatDate(invoice.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}

                {invoices.length > 5 && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => (window.location.href = "/invoices")}
                  >
                    Voir toutes les factures ({invoices.length})
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
