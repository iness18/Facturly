"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { buildApiUrl } from "@/config/api";

interface AdminStats {
  totalUsers: number;
  totalClients: number;
  totalInvoices: number;
  totalRevenue: number;
  recentUsers: number;
  dailyInvoices: number;
  weeklyInvoices: number;
  monthlyInvoices: number;
  activeUsers: number;
  inactiveUsers: number;
  systemAlerts: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: string;
  isActive: boolean;
  isBanned?: boolean;
  createdAt: string;
  _count: {
    invoices: number;
    clients: number;
  };
  subscription?: {
    plan: string;
    status: string;
    endDate: string;
  };
}

interface Pack {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  limits: {
    invoices: number;
    clients: number;
    exports: number;
  };
  isActive: boolean;
  subscribersCount: number;
}

interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: "completed" | "failed" | "pending" | "refunded";
  stripeId: string;
  createdAt: string;
  packName: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: "draft" | "scheduled" | "sent";
  recipientsCount: number;
  openRate: number;
  clickRate: number;
  scheduledAt?: string;
  sentAt?: string;
}

interface PromoCode {
  id: string;
  code: string;
  description: string;
  discount: number;
  type: "percentage" | "fixed";
  maxUses: number;
  currentUses: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

interface SiteContent {
  slogan: string;
  aboutPage: string;
  faq: string;
  termsOfService: string;
  privacyPolicy: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
}

interface Ticket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

interface SystemSettings {
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  maxUsersPerAccount: number;
  emailNotifications: boolean;
  backupFrequency: string;
  dataRetentionDays: number;
  stripePublicKey: string;
  stripeSecretKey: string;
  freeInvoicesPerMonth: number;
  pdfApiKey: string;
}

type TabType =
  | "dashboard"
  | "users"
  | "packs"
  | "payments"
  | "marketing"
  | "content"
  | "tickets"
  | "settings"
  | "roles";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>({
    slogan: "Facturez en toute simplicité",
    aboutPage:
      "Facturly est la solution de facturation moderne pour les entrepreneurs et PME. Notre plateforme vous permet de créer, envoyer et gérer vos factures en quelques clics.",
    faq: "## Questions fréquemment posées\n\n**Comment créer ma première facture ?**\nRendez-vous dans l'onglet Factures et cliquez sur 'Nouvelle facture'.\n\n**Puis-je personnaliser mes factures ?**\nOui, vous pouvez ajouter votre logo et personnaliser les couleurs.",
    termsOfService:
      "## Conditions générales d'utilisation\n\nDernière mise à jour : Janvier 2025\n\n### 1. Acceptation des conditions\nEn utilisant Facturly, vous acceptez ces conditions...",
    privacyPolicy:
      "## Politique de confidentialité\n\nNous respectons votre vie privée et protégeons vos données personnelles...",
    logo: "/facturly-logo.svg",
    favicon: "/favicon.ico",
    primaryColor: "#a855f7",
    secondaryColor: "#ec4899",
  });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    allowRegistrations: true,
    maxUsersPerAccount: 1000,
    emailNotifications: true,
    backupFrequency: "daily",
    dataRetentionDays: 365,
    stripePublicKey: "",
    stripeSecretKey: "",
    freeInvoicesPerMonth: 10,
    pdfApiKey: "",
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [showPackModal, setShowPackModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] =
    useState<EmailCampaign | null>(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(
    null
  );
  const [showPromoCodeModal, setShowPromoCodeModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // Charger les données depuis l'API backend simple
      const response = await fetch("http://localhost:3001/admin/dashboard");
      const dashboardData = await response.json();

      const usersResponse = await fetch("http://localhost:3001/admin/users");
      const usersData = await usersResponse.json();

      setStats({
        totalUsers: dashboardData.users?.total || 0,
        totalClients: dashboardData.clients?.total || 0,
        totalInvoices: dashboardData.invoices?.total || 0,
        totalRevenue: dashboardData.revenue?.total || 0,
        recentUsers: dashboardData.users?.active || 0,
        dailyInvoices: 0,
        weeklyInvoices: 0,
        monthlyInvoices: 0,
        activeUsers: dashboardData.users?.active || 0,
        inactiveUsers: 0,
        systemAlerts: 0,
      });

      setUsers(usersData.users || []);

      // Charger les packs depuis l'API
      const packsResponse = await fetch("http://localhost:3001/admin/packs");
      const packsData = await packsResponse.json();
      setPacks(packsData.packs || []);

      setPayments([
        {
          id: "1",
          userId: "user1",
          userName: "Jean Dupont",
          userEmail: "jean@example.com",
          amount: 19.99,
          status: "completed",
          stripeId: "pi_1234567890",
          createdAt: new Date().toISOString(),
          packName: "Pack Pro",
        },
      ]);

      setCampaigns([
        {
          id: "1",
          name: "Newsletter Janvier",
          subject: "Nouveautés Facturly 2025",
          content:
            "Découvrez les nouvelles fonctionnalités de Facturly pour cette nouvelle année !",
          status: "sent",
          recipientsCount: 1250,
          openRate: 24.5,
          clickRate: 3.2,
          sentAt: new Date().toISOString(),
        },
      ]);

      setPromoCodes([
        {
          id: "1",
          code: "WELCOME2025",
          description: "Réduction de bienvenue",
          discount: 20,
          type: "percentage",
          maxUses: 100,
          currentUses: 23,
          validFrom: new Date().toISOString(),
          validUntil: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          isActive: true,
        },
      ]);

      setTickets([
        {
          id: "1",
          userId: "user1",
          userName: "Marie Martin",
          userEmail: "marie@example.com",
          subject: "Problème génération PDF",
          description:
            "Je n'arrive pas à générer le PDF de ma facture, j'obtiens une erreur 500.",
          status: "open",
          priority: "high",
          category: "PDF",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Erreur lors du chargement des données admin:", error);
      // Données par défaut en cas d'erreur
      setStats({
        totalUsers: 0,
        totalClients: 0,
        totalInvoices: 0,
        totalRevenue: 0,
        recentUsers: 0,
        dailyInvoices: 0,
        weeklyInvoices: 0,
        monthlyInvoices: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        systemAlerts: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonctions utilitaires
  const deleteUser = async (userId: string) => {
    // Popup d'avertissement
    const userToDelete = users.find((user) => user.id === userId);
    const confirmDelete = window.confirm(
      `⚠️ ATTENTION ⚠️\n\nÊtes-vous sûr de vouloir supprimer définitivement l'utilisateur "${userToDelete?.name}" ?\n\nCette action est IRRÉVERSIBLE et supprimera :\n- Le compte utilisateur\n- Toutes ses factures\n- Tous ses clients\n- Toutes ses données\n\nTapez "SUPPRIMER" pour confirmer cette action dangereuse.`
    );

    if (!confirmDelete) {
      return;
    }

    // Demande de confirmation supplémentaire
    const confirmText = window.prompt(
      `Pour confirmer la suppression de "${userToDelete?.name}", tapez exactement : SUPPRIMER`
    );

    if (confirmText !== "SUPPRIMER") {
      alert("Suppression annulée. Le texte de confirmation ne correspond pas.");
      return;
    }

    try {
      console.log("Supprimer utilisateur:", userId);

      // Appel API pour supprimer l'utilisateur (à implémenter côté backend)
      const response = await fetch(
        `http://localhost:3001/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Supprimer l'utilisateur de la liste locale
        setUsers(users.filter((user) => user.id !== userId));
        alert(
          `✅ L'utilisateur "${userToDelete?.name}" a été supprimé avec succès.`
        );
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de la suppression:", errorData);
        alert(
          `❌ Erreur lors de la suppression: ${
            errorData.message || "Erreur inconnue"
          }`
        );
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("❌ Erreur de connexion lors de la suppression de l'utilisateur.");
    }
  };

  const resetPassword = async (userId: string) => {
    try {
      console.log("Réinitialiser mot de passe:", userId);
      alert(
        "Mot de passe réinitialisé ! Un email a été envoyé à l'utilisateur."
      );
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error);
    }
  };

  // Fonctions pour les campagnes email
  const createNewCampaign = () => {
    setSelectedCampaign(null);
    setShowCampaignModal(true);
  };

  const editCampaign = (campaign: EmailCampaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignModal(true);
  };

  const saveCampaign = async (campaignData: any) => {
    try {
      if (selectedCampaign) {
        // Modifier une campagne existante
        const updatedCampaigns = campaigns.map((campaign) =>
          campaign.id === selectedCampaign.id
            ? { ...campaign, ...campaignData, id: selectedCampaign.id }
            : campaign
        );
        setCampaigns(updatedCampaigns);
        alert("✅ Campagne modifiée avec succès !");
      } else {
        // Créer une nouvelle campagne
        const newCampaign: EmailCampaign = {
          id: Date.now().toString(),
          ...campaignData,
          status: "draft" as const,
          recipientsCount: 0,
          openRate: 0,
          clickRate: 0,
        };
        setCampaigns([...campaigns, newCampaign]);
        alert("✅ Nouvelle campagne créée avec succès !");
      }
      setShowCampaignModal(false);
      setSelectedCampaign(null);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("❌ Erreur lors de la sauvegarde de la campagne.");
    }
  };

  const toggleCampaignStatus = async (campaignId: string) => {
    try {
      const campaign = campaigns.find((c) => c.id === campaignId);
      if (!campaign) return;

      const newStatus: "draft" | "scheduled" | "sent" =
        campaign.status === "draft" ? "scheduled" : "draft";
      const updatedCampaigns = campaigns.map((c) =>
        c.id === campaignId ? { ...c, status: newStatus } : c
      );
      setCampaigns(updatedCampaigns);

      const statusText = newStatus === "scheduled" ? "activée" : "désactivée";
      alert(`✅ Campagne ${statusText} avec succès !`);
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      alert("❌ Erreur lors du changement de statut de la campagne.");
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) return;

    const confirmDelete = window.confirm(
      `⚠️ ATTENTION ⚠️\n\nÊtes-vous sûr de vouloir supprimer définitivement la campagne "${campaign.name}" ?\n\nCette action est IRRÉVERSIBLE et supprimera :\n- La campagne email\n- Toutes les statistiques associées\n- L'historique d'envoi\n\nCliquez sur OK pour confirmer la suppression.`
    );

    if (!confirmDelete) return;

    try {
      const updatedCampaigns = campaigns.filter((c) => c.id !== campaignId);
      setCampaigns(updatedCampaigns);
      alert(`✅ La campagne "${campaign.name}" a été supprimée avec succès.`);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("❌ Erreur lors de la suppression de la campagne.");
    }
  };

  // Fonctions pour les codes promo
  const createNewPromoCode = () => {
    setSelectedPromoCode(null);
    setShowPromoCodeModal(true);
  };

  const editPromoCode = (promoCode: PromoCode) => {
    setSelectedPromoCode(promoCode);
    setShowPromoCodeModal(true);
  };

  const savePromoCode = async (promoCodeData: any) => {
    try {
      if (selectedPromoCode) {
        // Modifier un code promo existant
        const updatedPromoCodes = promoCodes.map((promo) =>
          promo.id === selectedPromoCode.id
            ? { ...promo, ...promoCodeData, id: selectedPromoCode.id }
            : promo
        );
        setPromoCodes(updatedPromoCodes);
        alert("✅ Code promo modifié avec succès !");
      } else {
        // Créer un nouveau code promo
        const newPromoCode: PromoCode = {
          id: Date.now().toString(),
          ...promoCodeData,
          currentUses: 0,
          isActive: true,
        };
        setPromoCodes([...promoCodes, newPromoCode]);
        alert("✅ Nouveau code promo créé avec succès !");
      }
      setShowPromoCodeModal(false);
      setSelectedPromoCode(null);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("❌ Erreur lors de la sauvegarde du code promo.");
    }
  };

  const togglePromoCodeStatus = async (promoCodeId: string) => {
    try {
      const updatedPromoCodes = promoCodes.map((promo) =>
        promo.id === promoCodeId
          ? { ...promo, isActive: !promo.isActive }
          : promo
      );
      setPromoCodes(updatedPromoCodes);

      const promo = promoCodes.find((p) => p.id === promoCodeId);
      const statusText = promo?.isActive ? "désactivé" : "activé";
      alert(`✅ Code promo ${statusText} avec succès !`);
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      alert("❌ Erreur lors du changement de statut du code promo.");
    }
  };

  const deletePromoCode = async (promoCodeId: string) => {
    const promoCode = promoCodes.find((p) => p.id === promoCodeId);
    if (!promoCode) return;

    const confirmDelete = window.confirm(
      `⚠️ ATTENTION ⚠️\n\nÊtes-vous sûr de vouloir supprimer définitivement le code promo "${promoCode.code}" ?\n\nCette action est IRRÉVERSIBLE et supprimera :\n- Le code promo\n- Toutes les statistiques d'utilisation\n- L'historique des utilisations\n\nCliquez sur OK pour confirmer la suppression.`
    );

    if (!confirmDelete) return;

    try {
      const updatedPromoCodes = promoCodes.filter((p) => p.id !== promoCodeId);
      setPromoCodes(updatedPromoCodes);
      alert(`✅ Le code promo "${promoCode.code}" a été supprimé avec succès.`);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("❌ Erreur lors de la suppression du code promo.");
    }
  };

  const createNewPack = async () => {
    const packData = {
      name: "Nouveau Pack",
      description: "Description du nouveau pack",
      price: 29.99,
      duration: 30,
      features: ["Fonctionnalité 1", "Fonctionnalité 2"],
      limits: {
        invoices: 100,
        clients: 50,
        exports: 25,
      },
    };

    try {
      const response = await fetch("http://localhost:3001/admin/packs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(packData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Pack créé:", result);
        // Recharger les packs depuis l'API
        const packsResponse = await fetch("http://localhost:3001/admin/packs");
        const packsData = await packsResponse.json();
        setPacks(packsData.packs || []);
      } else {
        console.error("Erreur lors de la création du pack");
        alert("Erreur lors de la création du pack");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion");
    }
  };

  const editPack = (pack: Pack) => {
    setSelectedPack(pack);
    setShowPackModal(true);
  };

  const updatePack = async (packData: any) => {
    if (!selectedPack) return;

    try {
      const response = await fetch(
        `http://localhost:3001/admin/packs/${selectedPack.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(packData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Pack mis à jour:", result);
        // Recharger les packs depuis l'API
        const packsResponse = await fetch("http://localhost:3001/admin/packs");
        const packsData = await packsResponse.json();
        setPacks(packsData.packs || []);
        setShowPackModal(false);
        setSelectedPack(null);
      } else {
        console.error("Erreur lors de la mise à jour du pack");
        alert("Erreur lors de la mise à jour du pack");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion");
    }
  };

  const deletePack = async (packId: string) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer ce pack ? Cette action est irréversible."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/admin/packs/${packId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Pack supprimé");
        // Recharger les packs depuis l'API
        const packsResponse = await fetch("http://localhost:3001/admin/packs");
        const packsData = await packsResponse.json();
        setPacks(packsData.packs || []);
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de la suppression du pack:", errorData);
        alert(errorData.message || "Erreur lors de la suppression du pack");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion");
    }
  };

  const togglePackStatus = async (packId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/admin/packs/${packId}/toggle`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Statut du pack modifié:", result);
        // Recharger les packs depuis l'API
        const packsResponse = await fetch("http://localhost:3001/admin/packs");
        const packsData = await packsResponse.json();
        setPacks(packsData.packs || []);
      } else {
        console.error("Erreur lors du changement de statut du pack");
        alert("Erreur lors du changement de statut du pack");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion");
    }
  };

  const sendEmailCampaign = async (campaignId: string) => {
    try {
      console.log("Envoyer campagne:", campaignId);
      setCampaigns(
        campaigns.map((campaign) =>
          campaign.id === campaignId
            ? {
                ...campaign,
                status: "sent" as const,
                sentAt: new Date().toISOString(),
              }
            : campaign
        )
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
    }
  };

  const backupDatabase = async () => {
    try {
      console.log("Sauvegarde de la base de données...");
      alert(
        "Sauvegarde lancée ! Vous recevrez un email quand elle sera terminée."
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const renderTabNavigation = () => (
    <div
      style={{
        display: "flex",
        gap: "8px",
        marginBottom: "32px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        overflowX: "auto",
        paddingBottom: "8px",
      }}
    >
      {[
        { id: "dashboard", label: "🎛️ Tableau de bord" },
        { id: "users", label: "👥 Utilisateurs" },
        { id: "packs", label: "💼 Offres/Packs" },
        { id: "payments", label: "🧾 Paiements" },
        { id: "marketing", label: "💌 Marketing" },
        { id: "content", label: "📝 Contenu" },
        { id: "tickets", label: "🐛 Tickets" },
        { id: "settings", label: "🛠️ Paramètres" },
        { id: "roles", label: "🔒 Rôles" },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as TabType)}
          style={{
            background:
              activeTab === tab.id
                ? "rgba(168, 85, 247, 0.2)"
                : "rgba(255, 255, 255, 0.05)",
            border:
              activeTab === tab.id
                ? "1px solid rgba(168, 85, 247, 0.5)"
                : "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px 8px 0 0",
            padding: "12px 16px",
            color: activeTab === tab.id ? "#a855f7" : "#d1d5db",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s ease",
            fontWeight: activeTab === tab.id ? "600" : "400",
            fontSize: "14px",
            whiteSpace: "nowrap",
            minWidth: "fit-content",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  // 🎛️ 1. Tableau de bord général
  const renderDashboardTab = () => (
    <div>
      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
            marginBottom: "48px",
          }}
        >
          {/* Chiffre d'affaires */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#d1d5db",
                }}
              >
                Chiffre d'Affaires
              </h3>
              <span style={{ fontSize: "20px" }}>📈</span>
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            >
              {stats.totalRevenue.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </div>
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>
              Commissions et abonnements
            </p>
          </div>

          {/* Factures générées */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#d1d5db",
                }}
              >
                Factures Générées
              </h3>
              <span style={{ fontSize: "20px" }}>📄</span>
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            >
              {stats.totalInvoices}
            </div>
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>
              <div>Aujourd'hui: {stats.dailyInvoices}</div>
              <div>Cette semaine: {stats.weeklyInvoices}</div>
              <div>Ce mois: {stats.monthlyInvoices}</div>
            </div>
          </div>

          {/* Utilisateurs */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#d1d5db",
                }}
              >
                Utilisateurs
              </h3>
              <span style={{ fontSize: "20px" }}>👥</span>
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            >
              {stats.totalUsers}
            </div>
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>
              <div style={{ color: "#22c55e" }}>
                Actifs: {stats.activeUsers}
              </div>
              <div style={{ color: "#ef4444" }}>
                Inactifs: {stats.inactiveUsers}
              </div>
              <div>Nouveaux ce mois: {stats.recentUsers}</div>
            </div>
          </div>

          {/* Alertes système */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#d1d5db",
                }}
              >
                Alertes Système
              </h3>
              <span style={{ fontSize: "20px" }}>🚨</span>
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "4px",
                color: stats.systemAlerts > 0 ? "#ef4444" : "#22c55e",
              }}
            >
              {stats.systemAlerts}
            </div>
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>
              Erreurs PDF, échecs paiements
            </p>
          </div>
        </div>
      )}

      {/* Derniers inscrits */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          📅 Derniers Inscrits
        </h3>
        <div style={{ display: "grid", gap: "12px" }}>
          {users.slice(0, 5).map((user) => (
            <div
              key={user.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "8px",
              }}
            >
              <div>
                <div style={{ fontWeight: "500" }}>{user.name}</div>
                <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                  {user.email}
                </div>
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                {new Date(user.createdAt).toLocaleDateString("fr-FR")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 👥 2. Gestion des utilisateurs
  const renderUsersTab = () => (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="🔍 Rechercher par email ou nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "400px",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            padding: "12px 16px",
            color: "#ffffff",
            fontSize: "14px",
          }}
        />
      </div>

      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "24px",
          }}
        >
          👥 Gestion des Utilisateurs
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
              >
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Utilisateur
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Plan Souscrit
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Activité
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Statut
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(
                  (user) =>
                    user.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user) => (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <td style={{ padding: "16px" }}>
                      <div>
                        <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "500",
                          background: "rgba(34, 197, 94, 0.2)",
                          color: "#22c55e",
                        }}
                      >
                        {user.subscription?.plan || "Gratuit"}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontSize: "14px" }}>
                        <div>{user._count.invoices} factures</div>
                        <div style={{ color: "#9ca3af" }}>
                          {user._count.clients} clients
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "500",
                            background: user.isActive
                              ? "rgba(34, 197, 94, 0.2)"
                              : "rgba(239, 68, 68, 0.2)",
                            color: user.isActive ? "#22c55e" : "#ef4444",
                          }}
                        >
                          {user.isActive ? "Actif" : "Inactif"}
                        </span>
                        {user.isBanned && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "500",
                              background: "rgba(239, 68, 68, 0.2)",
                              color: "#ef4444",
                            }}
                          >
                            Banni
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          onClick={() => setSelectedUser(user)}
                          style={{
                            background: "rgba(59, 130, 246, 0.2)",
                            border: "1px solid rgba(59, 130, 246, 0.3)",
                            borderRadius: "6px",
                            padding: "6px 12px",
                            color: "#3b82f6",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          📋 Détails
                        </button>
                        {user.role !== "ADMIN" && (
                          <>
                            <button
                              onClick={() => deleteUser(user.id)}
                              style={{
                                background: "rgba(239, 68, 68, 0.2)",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                                borderRadius: "6px",
                                padding: "6px 12px",
                                color: "#ef4444",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                            >
                              🗑️ Supprimer l'user
                            </button>
                            <button
                              onClick={() => resetPassword(user.id)}
                              style={{
                                background: "rgba(168, 85, 247, 0.2)",
                                border: "1px solid rgba(168, 85, 247, 0.3)",
                                borderRadius: "6px",
                                padding: "6px 12px",
                                color: "#a855f7",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                            >
                              🔄 Reset MDP
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 💼 3. Gestion des offres/packs
  const renderPacksTab = () => (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          💼 Gestion des Offres/Packs
        </h2>
        <button
          onClick={() => createNewPack()}
          style={{
            background: "rgba(34, 197, 94, 0.2)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            borderRadius: "8px",
            padding: "12px 20px",
            color: "#22c55e",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          ➕ Nouveau Pack
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
        }}
      >
        {packs.map((pack) => (
          <div
            key={pack.id}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  {pack.name}
                </h3>
                <p style={{ color: "#9ca3af", fontSize: "14px" }}>
                  {pack.description}
                </p>
              </div>
              <span
                style={{
                  background: pack.isActive
                    ? "rgba(34, 197, 94, 0.2)"
                    : "rgba(239, 68, 68, 0.2)",
                  color: pack.isActive ? "#22c55e" : "#ef4444",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {pack.isActive ? "Actif" : "Inactif"}
              </span>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                {pack.price === 0 ? "Gratuit" : `${pack.price}€/mois`}
              </div>
              <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                {pack.subscribersCount} abonnés
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Fonctionnalités:
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {pack.features.map((feature, index) => (
                  <li
                    key={index}
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      marginBottom: "4px",
                      paddingLeft: "16px",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: "0",
                        color: "#22c55e",
                      }}
                    >
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => editPack(pack)}
                style={{
                  background: "rgba(59, 130, 246, 0.2)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "6px",
                  padding: "8px 16px",
                  color: "#3b82f6",
                  cursor: "pointer",
                  fontSize: "12px",
                  flex: 1,
                }}
              >
                ✏️ Modifier
              </button>
              <button
                onClick={() => togglePackStatus(pack.id)}
                style={{
                  background: pack.isActive
                    ? "rgba(239, 68, 68, 0.2)"
                    : "rgba(34, 197, 94, 0.2)",
                  border: pack.isActive
                    ? "1px solid rgba(239, 68, 68, 0.3)"
                    : "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "6px",
                  padding: "8px 16px",
                  color: pack.isActive ? "#ef4444" : "#22c55e",
                  cursor: "pointer",
                  fontSize: "12px",
                  flex: 1,
                }}
              >
                {pack.isActive ? "🚫 Désactiver" : "✅ Activer"}
              </button>
              <button
                onClick={() => deletePack(pack.id)}
                style={{
                  background: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "6px",
                  padding: "8px 16px",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontSize: "12px",
                  minWidth: "40px",
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 🧾 4. Suivi des paiements
  const renderPaymentsTab = () => (
    <div>
      <h2
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "24px" }}
      >
        🧾 Suivi des Paiements Stripe
      </h2>

      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
              >
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Utilisateur
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Pack
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Montant
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Statut
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
                >
                  <td style={{ padding: "16px" }}>
                    <div>
                      <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                        {payment.userName}
                      </div>
                      <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                        {payment.userEmail}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>{payment.packName}</td>
                  <td style={{ padding: "16px", fontWeight: "600" }}>
                    {payment.amount.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "500",
                        background:
                          payment.status === "completed"
                            ? "rgba(34, 197, 94, 0.2)"
                            : payment.status === "failed"
                            ? "rgba(239, 68, 68, 0.2)"
                            : payment.status === "pending"
                            ? "rgba(251, 191, 36, 0.2)"
                            : "rgba(156, 163, 175, 0.2)",
                        color:
                          payment.status === "completed"
                            ? "#22c55e"
                            : payment.status === "failed"
                            ? "#ef4444"
                            : payment.status === "pending"
                            ? "#f59e0b"
                            : "#9ca3af",
                      }}
                    >
                      {payment.status === "completed"
                        ? "✅ Complété"
                        : payment.status === "failed"
                        ? "❌ Échoué"
                        : payment.status === "pending"
                        ? "⏳ En attente"
                        : "🔄 Remboursé"}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      fontSize: "14px",
                      color: "#9ca3af",
                    }}
                  >
                    {new Date(payment.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        style={{
                          background: "rgba(59, 130, 246, 0.2)",
                          border: "1px solid rgba(59, 130, 246, 0.3)",
                          borderRadius: "6px",
                          padding: "6px 12px",
                          color: "#3b82f6",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        📄 Reçu
                      </button>
                      {payment.status === "completed" && (
                        <button
                          style={{
                            background: "rgba(239, 68, 68, 0.2)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            borderRadius: "6px",
                            padding: "6px 12px",
                            color: "#ef4444",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          🔄 Rembourser
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 💌 5. Outils marketing
  const renderMarketingTab = () => (
    <div>
      <h2
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "24px" }}
      >
        💌 Outils Marketing
      </h2>

      {/* Campagnes email */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
            📧 Campagnes Email
          </h3>
          <button
            onClick={createNewCampaign}
            style={{
              background: "rgba(34, 197, 94, 0.2)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "8px",
              padding: "8px 16px",
              color: "#22c55e",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ➕ Nouvelle Campagne
          </button>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <h4 style={{ fontWeight: "600", marginBottom: "4px" }}>
                    {campaign.name}
                  </h4>
                  <p style={{ fontSize: "14px", color: "#9ca3af" }}>
                    {campaign.subject}
                  </p>
                </div>
                <span
                  style={{
                    background:
                      campaign.status === "sent"
                        ? "rgba(34, 197, 94, 0.2)"
                        : campaign.status === "scheduled"
                        ? "rgba(251, 191, 36, 0.2)"
                        : "rgba(156, 163, 175, 0.2)",
                    color:
                      campaign.status === "sent"
                        ? "#22c55e"
                        : campaign.status === "scheduled"
                        ? "#f59e0b"
                        : "#9ca3af",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  {campaign.status === "sent"
                    ? "Envoyée"
                    : campaign.status === "scheduled"
                    ? "Programmée"
                    : "Brouillon"}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  gap: "16px",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                    Destinataires
                  </div>
                  <div style={{ fontWeight: "600" }}>
                    {campaign.recipientsCount}
                  </div>
                </div>
                {campaign.status === "sent" && (
                  <>
                    <div>
                      <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                        Taux d'ouverture
                      </div>
                      <div style={{ fontWeight: "600", color: "#22c55e" }}>
                        {campaign.openRate}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                        Taux de clic
                      </div>
                      <div style={{ fontWeight: "600", color: "#3b82f6" }}>
                        {campaign.clickRate}%
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  onClick={() => editCampaign(campaign)}
                  style={{
                    background: "rgba(59, 130, 246, 0.2)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    color: "#3b82f6",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  ✏️ Modifier
                </button>
                {campaign.status !== "sent" && (
                  <>
                    <button
                      onClick={() => sendEmailCampaign(campaign.id)}
                      style={{
                        background: "rgba(34, 197, 94, 0.2)",
                        border: "1px solid rgba(34, 197, 94, 0.3)",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        color: "#22c55e",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      📤 Envoyer
                    </button>
                    <button
                      onClick={() => toggleCampaignStatus(campaign.id)}
                      style={{
                        background:
                          campaign.status === "scheduled"
                            ? "rgba(239, 68, 68, 0.2)"
                            : "rgba(251, 191, 36, 0.2)",
                        border:
                          campaign.status === "scheduled"
                            ? "1px solid rgba(239, 68, 68, 0.3)"
                            : "1px solid rgba(251, 191, 36, 0.3)",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        color:
                          campaign.status === "scheduled"
                            ? "#ef4444"
                            : "#f59e0b",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      {campaign.status === "scheduled"
                        ? "🚫 Désactiver"
                        : "✅ Activer"}
                    </button>
                  </>
                )}
                <button
                  onClick={() => deleteCampaign(campaign.id)}
                  style={{
                    background: "rgba(239, 68, 68, 0.2)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    color: "#ef4444",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Codes promo */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
            🎫 Codes Promo
          </h3>
          <button
            onClick={createNewPromoCode}
            style={{
              background: "rgba(34, 197, 94, 0.2)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "8px",
              padding: "8px 16px",
              color: "#22c55e",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ➕ Nouveau Code
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
              >
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Code
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Réduction
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Utilisations
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Validité
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Statut
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promo) => (
                <tr
                  key={promo.id}
                  style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
                >
                  <td style={{ padding: "12px" }}>
                    <div>
                      <div
                        style={{ fontWeight: "600", fontFamily: "monospace" }}
                      >
                        {promo.code}
                      </div>
                      <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                        {promo.description}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px", fontWeight: "600" }}>
                    {promo.type === "percentage"
                      ? `${promo.discount}%`
                      : `${promo.discount}€`}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ fontSize: "14px" }}>
                      {promo.currentUses} / {promo.maxUses}
                    </div>
                    <div
                      style={{
                        width: "100px",
                        height: "4px",
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "2px",
                        marginTop: "4px",
                      }}
                    >
                      <div
                        style={{
                          width: `${
                            (promo.currentUses / promo.maxUses) * 100
                          }%`,
                          height: "100%",
                          background: "#3b82f6",
                          borderRadius: "2px",
                        }}
                      />
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: "12px",
                      color: "#9ca3af",
                    }}
                  >
                    Jusqu'au{" "}
                    {new Date(promo.validUntil).toLocaleDateString("fr-FR")}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        background: promo.isActive
                          ? "rgba(34, 197, 94, 0.2)"
                          : "rgba(239, 68, 68, 0.2)",
                        color: promo.isActive ? "#22c55e" : "#ef4444",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {promo.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => editPromoCode(promo)}
                        style={{
                          background: "rgba(59, 130, 246, 0.2)",
                          border: "1px solid rgba(59, 130, 246, 0.3)",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          color: "#3b82f6",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => togglePromoCodeStatus(promo.id)}
                        style={{
                          background: promo.isActive
                            ? "rgba(239, 68, 68, 0.2)"
                            : "rgba(34, 197, 94, 0.2)",
                          border: promo.isActive
                            ? "1px solid rgba(239, 68, 68, 0.3)"
                            : "1px solid rgba(34, 197, 94, 0.3)",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          color: promo.isActive ? "#ef4444" : "#22c55e",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        {promo.isActive ? "🚫" : "✅"}
                      </button>
                      <button
                        onClick={() => deletePromoCode(promo.id)}
                        style={{
                          background: "rgba(239, 68, 68, 0.2)",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          color: "#ef4444",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 📝 6. Gestion du contenu du site
  const renderContentTab = () => (
    <div>
      <h2
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "24px" }}
      >
        📝 Gestion du Contenu du Site
      </h2>

      <div style={{ display: "grid", gap: "24px" }}>
        {/* Slogan et branding */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            🎨 Branding
          </h3>

          <div style={{ display: "grid", gap: "16px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Slogan principal
              </label>
              <input
                type="text"
                value={siteContent.slogan}
                onChange={(e) =>
                  setSiteContent({ ...siteContent, slogan: e.target.value })
                }
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    color: "#d1d5db",
                  }}
                >
                  Couleur primaire
                </label>
                <input
                  type="color"
                  value={siteContent.primaryColor}
                  onChange={(e) =>
                    setSiteContent({
                      ...siteContent,
                      primaryColor: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    height: "40px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    color: "#d1d5db",
                  }}
                >
                  Couleur secondaire
                </label>
                <input
                  type="color"
                  value={siteContent.secondaryColor}
                  onChange={(e) =>
                    setSiteContent({
                      ...siteContent,
                      secondaryColor: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    height: "40px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pages de contenu */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            📄 Pages de Contenu
          </h3>

          <div style={{ display: "grid", gap: "24px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Page À Propos
              </label>
              <textarea
                value={siteContent.aboutPage}
                onChange={(e) =>
                  setSiteContent({ ...siteContent, aboutPage: e.target.value })
                }
                rows={4}
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                  resize: "vertical",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                FAQ (Markdown)
              </label>
              <textarea
                value={siteContent.faq}
                onChange={(e) =>
                  setSiteContent({ ...siteContent, faq: e.target.value })
                }
                rows={6}
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontFamily: "monospace",
                  resize: "vertical",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Conditions d'utilisation (Markdown)
              </label>
              <textarea
                value={siteContent.termsOfService}
                onChange={(e) =>
                  setSiteContent({
                    ...siteContent,
                    termsOfService: e.target.value,
                  })
                }
                rows={6}
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontFamily: "monospace",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
            <button
              style={{
                background: "rgba(34, 197, 94, 0.2)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "8px",
                padding: "12px 20px",
                color: "#22c55e",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              💾 Sauvegarder
            </button>
            <button
              style={{
                background: "rgba(59, 130, 246, 0.2)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "8px",
                padding: "12px 20px",
                color: "#3b82f6",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              👁️ Prévisualiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // 🐛 7. Gestion des tickets/erreurs
  const renderTicketsTab = () => (
    <div>
      <h2
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "24px" }}
      >
        🐛 Gestion des Tickets & Erreurs
      </h2>

      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
              >
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Ticket
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Utilisateur
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Priorité
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Statut
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
                >
                  <td style={{ padding: "16px" }}>
                    <div>
                      <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                        {ticket.subject}
                      </div>
                      <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                        #{ticket.id}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div>
                      <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                        {ticket.userName}
                      </div>
                      <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                        {ticket.userEmail}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "500",
                        background:
                          ticket.priority === "urgent"
                            ? "rgba(239, 68, 68, 0.2)"
                            : ticket.priority === "high"
                            ? "rgba(251, 191, 36, 0.2)"
                            : ticket.priority === "medium"
                            ? "rgba(59, 130, 246, 0.2)"
                            : "rgba(156, 163, 175, 0.2)",
                        color:
                          ticket.priority === "urgent"
                            ? "#ef4444"
                            : ticket.priority === "high"
                            ? "#f59e0b"
                            : ticket.priority === "medium"
                            ? "#3b82f6"
                            : "#9ca3af",
                      }}
                    >
                      {ticket.priority === "urgent"
                        ? "🚨 Urgent"
                        : ticket.priority === "high"
                        ? "⚠️ Élevée"
                        : ticket.priority === "medium"
                        ? "📋 Moyenne"
                        : "📝 Faible"}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "500",
                        background:
                          ticket.status === "resolved"
                            ? "rgba(34, 197, 94, 0.2)"
                            : ticket.status === "in_progress"
                            ? "rgba(251, 191, 36, 0.2)"
                            : ticket.status === "closed"
                            ? "rgba(156, 163, 175, 0.2)"
                            : "rgba(239, 68, 68, 0.2)",
                        color:
                          ticket.status === "resolved"
                            ? "#22c55e"
                            : ticket.status === "in_progress"
                            ? "#f59e0b"
                            : ticket.status === "closed"
                            ? "#9ca3af"
                            : "#ef4444",
                      }}
                    >
                      {ticket.status === "resolved"
                        ? "✅ Résolu"
                        : ticket.status === "in_progress"
                        ? "⏳ En cours"
                        : ticket.status === "closed"
                        ? "🔒 Fermé"
                        : "🆕 Ouvert"}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      fontSize: "14px",
                      color: "#9ca3af",
                    }}
                  >
                    {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        style={{
                          background: "rgba(59, 130, 246, 0.2)",
                          border: "1px solid rgba(59, 130, 246, 0.3)",
                          borderRadius: "6px",
                          padding: "6px 12px",
                          color: "#3b82f6",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        👁️ Voir
                      </button>
                      {ticket.status === "open" && (
                        <button
                          style={{
                            background: "rgba(251, 191, 36, 0.2)",
                            border: "1px solid rgba(251, 191, 36, 0.3)",
                            borderRadius: "6px",
                            padding: "6px 12px",
                            color: "#f59e0b",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          🔧 Traiter
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 🛠️ 8. Paramètres avancés
  const renderSettingsTab = () => (
    <div>
      <h2
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "24px" }}
      >
        🛠️ Paramètres Avancés
      </h2>

      <div style={{ display: "grid", gap: "24px" }}>
        {/* Paramètres système */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            ⚙️ Paramètres Système
          </h3>

          <div style={{ display: "grid", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                  Mode Maintenance
                </div>
                <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                  Désactive l'accès au site pour les utilisateurs
                </div>
              </div>
              <label
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "60px",
                  height: "34px",
                }}
              >
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maintenanceMode: e.target.checked,
                    })
                  }
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: settings.maintenanceMode
                      ? "#22c55e"
                      : "#374151",
                    transition: "0.4s",
                    borderRadius: "34px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      content: "",
                      height: "26px",
                      width: "26px",
                      left: settings.maintenanceMode ? "30px" : "4px",
                      bottom: "4px",
                      backgroundColor: "white",
                      transition: "0.4s",
                      borderRadius: "50%",
                    }}
                  />
                </span>
              </label>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                  Autoriser les inscriptions
                </div>
                <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                  Permet aux nouveaux utilisateurs de s'inscrire
                </div>
              </div>
              <label
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "60px",
                  height: "34px",
                }}
              >
                <input
                  type="checkbox"
                  checked={settings.allowRegistrations}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      allowRegistrations: e.target.checked,
                    })
                  }
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: settings.allowRegistrations
                      ? "#22c55e"
                      : "#374151",
                    transition: "0.4s",
                    borderRadius: "34px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      content: "",
                      height: "26px",
                      width: "26px",
                      left: settings.allowRegistrations ? "30px" : "4px",
                      bottom: "4px",
                      backgroundColor: "white",
                      transition: "0.4s",
                      borderRadius: "50%",
                    }}
                  />
                </span>
              </label>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Factures gratuites par mois
              </label>
              <input
                type="number"
                value={settings.freeInvoicesPerMonth}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    freeInvoicesPerMonth: parseInt(e.target.value),
                  })
                }
                style={{
                  width: "200px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>
        </div>

        {/* Clés API */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            🔑 Clés API
          </h3>

          <div style={{ display: "grid", gap: "16px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Clé publique Stripe
              </label>
              <input
                type="text"
                value={settings.stripePublicKey}
                onChange={(e) =>
                  setSettings({ ...settings, stripePublicKey: e.target.value })
                }
                placeholder="pk_test_..."
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontFamily: "monospace",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Clé secrète Stripe
              </label>
              <input
                type="password"
                value={settings.stripeSecretKey}
                onChange={(e) =>
                  setSettings({ ...settings, stripeSecretKey: e.target.value })
                }
                placeholder="sk_test_..."
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontFamily: "monospace",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Clé API PDF
              </label>
              <input
                type="password"
                value={settings.pdfApiKey}
                onChange={(e) =>
                  setSettings({ ...settings, pdfApiKey: e.target.value })
                }
                placeholder="Clé API pour génération PDF"
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontFamily: "monospace",
                }}
              />
            </div>
          </div>
        </div>

        {/* Sauvegarde */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            💾 Sauvegarde & Maintenance
          </h3>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <button
              onClick={backupDatabase}
              style={{
                background: "rgba(34, 197, 94, 0.2)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "8px",
                padding: "12px 20px",
                color: "#22c55e",
                cursor: "pointer",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              💾 Sauvegarder BDD
            </button>

            <button
              style={{
                background: "rgba(59, 130, 246, 0.2)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "8px",
                padding: "12px 20px",
                color: "#3b82f6",
                cursor: "pointer",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              🧹 Nettoyer Logs
            </button>

            <button
              style={{
                background: "rgba(251, 191, 36, 0.2)",
                border: "1px solid rgba(251, 191, 36, 0.3)",
                borderRadius: "8px",
                padding: "12px 20px",
                color: "#f59e0b",
                cursor: "pointer",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              📊 Rapport Système
            </button>
          </div>
        </div>

        {/* Bouton de sauvegarde global */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            style={{
              background: "rgba(168, 85, 247, 0.2)",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              borderRadius: "8px",
              padding: "16px 32px",
              color: "#a855f7",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            💾 Sauvegarder tous les paramètres
          </button>
        </div>
      </div>
    </div>
  );

  // 🔒 9. Gestion des rôles admin
  const renderRolesTab = () => (
    <div>
      <h2
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "24px" }}
      >
        🔒 Gestion des Rôles Admin
      </h2>

      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
            👑 Administrateurs
          </h3>
          <button
            style={{
              background: "rgba(34, 197, 94, 0.2)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "8px",
              padding: "12px 20px",
              color: "#22c55e",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            ➕ Ajouter Admin
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
              >
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Administrateur
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Rôle
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Permissions
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Dernière connexion
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) => user.role === "ADMIN")
                .map((admin) => (
                  <tr
                    key={admin.id}
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <td style={{ padding: "16px" }}>
                      <div>
                        <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                          {admin.name}
                        </div>
                        <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                          {admin.email}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "500",
                          background: "rgba(168, 85, 247, 0.2)",
                          color: "#a855f7",
                        }}
                      >
                        👑 Super Admin
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#9ca3af",
                      }}
                    >
                      Toutes permissions
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#9ca3af",
                      }}
                    >
                      {new Date(admin.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          style={{
                            background: "rgba(59, 130, 246, 0.2)",
                            border: "1px solid rgba(59, 130, 246, 0.3)",
                            borderRadius: "6px",
                            padding: "6px 12px",
                            color: "#3b82f6",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          style={{
                            background: "rgba(239, 68, 68, 0.2)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            borderRadius: "6px",
                            padding: "6px 12px",
                            color: "#ef4444",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            background: "rgba(251, 191, 36, 0.1)",
            border: "1px solid rgba(251, 191, 36, 0.3)",
            borderRadius: "8px",
          }}
        >
          <h4
            style={{
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "8px",
              color: "#f59e0b",
            }}
          >
            ⚠️ Permissions disponibles
          </h4>
          <div
            style={{ fontSize: "12px", color: "#9ca3af", lineHeight: "1.5" }}
          >
            • <strong>Super Admin:</strong> Accès complet à toutes les
            fonctionnalités
            <br />• <strong>Modérateur:</strong> Gestion des utilisateurs et du
            contenu
            <br />• <strong>Support:</strong> Gestion des tickets et assistance
            utilisateurs
            <br />• <strong>Analyste:</strong> Accès aux statistiques et
            rapports
          </div>
        </div>
      </div>
    </div>
  );

  // Modal pour les détails utilisateur
  const renderUserModal = () => {
    if (!selectedUser) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            background: "rgba(17, 24, 39, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "32px",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              Détails de l'utilisateur
            </h3>
            <button
              onClick={() => setSelectedUser(null)}
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                padding: "8px 12px",
                color: "#ef4444",
                cursor: "pointer",
              }}
            >
              ✕ Fermer
            </button>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Informations générales
              </h4>
              <div style={{ display: "grid", gap: "8px", fontSize: "14px" }}>
                <div>
                  <strong>Nom:</strong> {selectedUser.name}
                </div>
                <div>
                  <strong>Email:</strong> {selectedUser.email}
                </div>
                <div>
                  <strong>Entreprise:</strong>{" "}
                  {selectedUser.company || "Non renseignée"}
                </div>
                <div>
                  <strong>Rôle:</strong> {selectedUser.role}
                </div>
                <div>
                  <strong>Inscription:</strong>{" "}
                  {new Date(selectedUser.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
            </div>

            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Activité
              </h4>
              <div style={{ display: "grid", gap: "8px", fontSize: "14px" }}>
                <div>
                  <strong>Factures créées:</strong>{" "}
                  {selectedUser._count.invoices}
                </div>
                <div>
                  <strong>Clients enregistrés:</strong>{" "}
                  {selectedUser._count.clients}
                </div>
                <div>
                  <strong>Statut:</strong>
                  <span
                    style={{
                      color: selectedUser.isActive ? "#22c55e" : "#ef4444",
                      marginLeft: "8px",
                    }}
                  >
                    {selectedUser.isActive ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>
            </div>

            {selectedUser.subscription && (
              <div>
                <h4
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: "#d1d5db",
                  }}
                >
                  Abonnement
                </h4>
                <div style={{ display: "grid", gap: "8px", fontSize: "14px" }}>
                  <div>
                    <strong>Plan:</strong> {selectedUser.subscription.plan}
                  </div>
                  <div>
                    <strong>Statut:</strong> {selectedUser.subscription.status}
                  </div>
                  <div>
                    <strong>Fin:</strong>{" "}
                    {new Date(
                      selectedUser.subscription.endDate
                    ).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Modal pour la modification des packs
  const renderPackModal = () => {
    if (!showPackModal || !selectedPack) return null;

    const [formData, setFormData] = useState({
      name: selectedPack.name,
      description: selectedPack.description,
      price: selectedPack.price,
      duration: selectedPack.duration,
      features: selectedPack.features.join("\n"),
      limits: {
        invoices: selectedPack.limits.invoices,
        clients: selectedPack.limits.clients,
        exports: selectedPack.limits.exports,
      },
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const packData = {
        ...formData,
        features: formData.features.split("\n").filter((f) => f.trim() !== ""),
      };
      updatePack(packData);
    };

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            background: "rgba(17, 24, 39, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "32px",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              Modifier le pack
            </h3>
            <button
              onClick={() => {
                setShowPackModal(false);
                setSelectedPack(null);
              }}
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                padding: "8px 12px",
                color: "#ef4444",
                cursor: "pointer",
              }}
            >
              ✕ Fermer
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gap: "16px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Nom du pack
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                }}
                required
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                  resize: "vertical",
                }}
                required
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    color: "#d1d5db",
                  }}
                >
                  Prix (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value),
                    })
                  }
                  style={{
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    color: "#ffffff",
                    fontSize: "14px",
                  }}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    color: "#d1d5db",
                  }}
                >
                  Durée (jours)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value),
                    })
                  }
                  style={{
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    color: "#ffffff",
                    fontSize: "14px",
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Fonctionnalités (une par ligne)
              </label>
              <textarea
                value={formData.features}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value })
                }
                rows={4}
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                  resize: "vertical",
                }}
                placeholder="Fonctionnalité 1&#10;Fonctionnalité 2&#10;Fonctionnalité 3"
              />
            </div>

            <div>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  color: "#d1d5db",
                }}
              >
                Limites
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      marginBottom: "8px",
                      color: "#d1d5db",
                    }}
                  >
                    Factures
                  </label>
                  <input
                    type="number"
                    value={formData.limits.invoices}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        limits: {
                          ...formData.limits,
                          invoices: parseInt(e.target.value),
                        },
                      })
                    }
                    style={{
                      width: "100%",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      color: "#ffffff",
                      fontSize: "14px",
                    }}
                    required
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      marginBottom: "8px",
                      color: "#d1d5db",
                    }}
                  >
                    Clients
                  </label>
                  <input
                    type="number"
                    value={formData.limits.clients}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        limits: {
                          ...formData.limits,
                          clients: parseInt(e.target.value),
                        },
                      })
                    }
                    style={{
                      width: "100%",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      color: "#ffffff",
                      fontSize: "14px",
                    }}
                    required
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      marginBottom: "8px",
                      color: "#d1d5db",
                    }}
                  >
                    Exports
                  </label>
                  <input
                    type="number"
                    value={formData.limits.exports}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        limits: {
                          ...formData.limits,
                          exports: parseInt(e.target.value),
                        },
                      })
                    }
                    style={{
                      width: "100%",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      color: "#ffffff",
                      fontSize: "14px",
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <button
                type="submit"
                style={{
                  background: "rgba(34, 197, 94, 0.2)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  color: "#22c55e",
                  cursor: "pointer",
                  fontWeight: "500",
                  flex: 1,
                }}
              >
                💾 Sauvegarder
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPackModal(false);
                  setSelectedPack(null);
                }}
                style={{
                  background: "rgba(156, 163, 175, 0.2)",
                  border: "1px solid rgba(156, 163, 175, 0.3)",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  color: "#9ca3af",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Modal pour les campagnes email
  const renderCampaignModal = () => {
    if (!showCampaignModal) return null;

    const [formData, setFormData] = useState({
      name: selectedCampaign?.name || "",
      subject: selectedCampaign?.subject || "",
      content: selectedCampaign?.content || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      saveCampaign(formData);
    };

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            background: "rgba(17, 24, 39, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "32px",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {selectedCampaign ? "Modifier la campagne" : "Nouvelle campagne"}
            </h3>
            <button
              onClick={() => {
                setShowCampaignModal(false);
                setSelectedCampaign(null);
              }}
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                padding: "8px 12px",
                color: "#ef4444",
                cursor: "pointer",
              }}
            >
              ✕ Fermer
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gap: "16px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Nom de la campagne
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Newsletter Février 2025"
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                }}
                required
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Sujet de l'email
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="Ex: Découvrez les nouveautés de Facturly"
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                }}
                required
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Contenu de l'email
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={6}
                placeholder="Rédigez le contenu de votre campagne email..."
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                  resize: "vertical",
                }}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <button
                type="submit"
                style={{
                  background: "rgba(34, 197, 94, 0.2)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  color: "#22c55e",
                  cursor: "pointer",
                  fontWeight: "500",
                  flex: 1,
                }}
              >
                💾 {selectedCampaign ? "Modifier" : "Créer"} la campagne
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCampaignModal(false);
                  setSelectedCampaign(null);
                }}
                style={{
                  background: "rgba(156, 163, 175, 0.2)",
                  border: "1px solid rgba(156, 163, 175, 0.3)",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  color: "#9ca3af",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Modal pour les codes promo
  const renderPromoCodeModal = () => {
    if (!showPromoCodeModal) return null;

    const [formData, setFormData] = useState({
      code: selectedPromoCode?.code || "",
      description: selectedPromoCode?.description || "",
      discount: selectedPromoCode?.discount || 0,
      type: selectedPromoCode?.type || ("percentage" as "percentage" | "fixed"),
      maxUses: selectedPromoCode?.maxUses || 100,
      validFrom: selectedPromoCode?.validFrom
        ? selectedPromoCode.validFrom.split("T")[0]
        : new Date().toISOString().split("T")[0],
      validUntil: selectedPromoCode?.validUntil
        ? selectedPromoCode.validUntil.split("T")[0]
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const promoCodeData = {
        ...formData,
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: new Date(formData.validUntil).toISOString(),
      };
      savePromoCode(promoCodeData);
    };

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            background: "rgba(17, 24, 39, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "32px",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {selectedPromoCode
                ? "Modifier le code promo"
                : "Nouveau code promo"}
            </h3>
            <button
              onClick={() => {
                setShowPromoCodeModal(false);
                setSelectedPromoCode(null);
              }}
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                padding: "8px 12px",
                color: "#ef4444",
                cursor: "pointer",
              }}
            >
              ✕ Fermer
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gap: "16px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Code promo
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="Ex: WELCOME2025"
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontFamily: "monospace",
                }}
                required
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Ex: Réduction de bienvenue"
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                }}
                required
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    color: "#d1d5db",
                  }}
                >
                  Type de réduction
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "percentage" | "fixed",
                    })
                  }
                  style={{
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    color: "#ffffff",
                    fontSize: "14px",
                  }}
                  required
                >
                  <option value="percentage">Pourcentage (%)</option>
                  <option value="fixed">Montant fixe (€)</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    color: "#d1d5db",
                  }}
                >
                  Valeur de la réduction
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount: parseFloat(e.target.value),
                    })
                  }
                  placeholder={formData.type === "percentage" ? "20" : "10.00"}
                  style={{
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    color: "#ffffff",
                    fontSize: "14px",
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "#d1d5db",
                }}
              >
                Nombre maximum d'utilisations
              </label>
              <input
                type="number"
                value={formData.maxUses}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxUses: parseInt(e.target.value),
                  })
                }
                placeholder="100"
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                }}
                required
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    color: "#d1d5db",
                  }}
                >
                  Valide à partir du
                </label>
                <input
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, validFrom: e.target.value })
                  }
                  style={{
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    color: "#ffffff",
                    fontSize: "14px",
                  }}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    color: "#d1d5db",
                  }}
                >
                  Valide jusqu'au
                </label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) =>
                    setFormData({ ...formData, validUntil: e.target.value })
                  }
                  style={{
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    color: "#ffffff",
                    fontSize: "14px",
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <button
                type="submit"
                style={{
                  background: "rgba(34, 197, 94, 0.2)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  color: "#22c55e",
                  cursor: "pointer",
                  fontWeight: "500",
                  flex: 1,
                }}
              >
                💾 {selectedPromoCode ? "Modifier" : "Créer"} le code promo
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPromoCodeModal(false);
                  setSelectedPromoCode(null);
                }}
                style={{
                  background: "rgba(156, 163, 175, 0.2)",
                  border: "1px solid rgba(156, 163, 175, 0.3)",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  color: "#9ca3af",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Rendu principal
  if (loading) {
    return (
      <ProtectedRoute>
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "16px",
              padding: "32px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "16px" }}>⏳</div>
            <div style={{ fontSize: "1.25rem", fontWeight: "600" }}>
              Chargement du panneau d'administration...
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "32px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background: "rgba(17, 24, 39, 0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              padding: "32px",
              color: "#ffffff",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "32px",
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    background: "linear-gradient(135deg, #a855f7, #ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  🎛️ Panneau d'Administration
                </h1>
                <p style={{ fontSize: "1.125rem", color: "#d1d5db" }}>
                  Gestion complète de la plateforme Facturly
                </p>
              </div>
              <div
                style={{ display: "flex", gap: "12px", alignItems: "center" }}
              >
                <div
                  style={{
                    background: "rgba(34, 197, 94, 0.2)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    borderRadius: "12px",
                    padding: "12px 20px",
                    color: "#22c55e",
                    fontWeight: "600",
                  }}
                >
                  🟢 Système opérationnel
                </div>
                <button
                  onClick={() => {
                    // Supprimer le token d'authentification
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("token");
                    // Rediriger vers la page de connexion
                    window.location.href = "/login";
                  }}
                  style={{
                    background: "rgba(239, 68, 68, 0.2)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "12px",
                    padding: "12px 20px",
                    color: "#ef4444",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                  }}
                >
                  🚪 Se déconnecter
                </button>
              </div>
            </div>

            {renderTabNavigation()}

            <div>
              {activeTab === "dashboard" && renderDashboardTab()}
              {activeTab === "users" && renderUsersTab()}
              {activeTab === "packs" && renderPacksTab()}
              {activeTab === "payments" && renderPaymentsTab()}
              {activeTab === "marketing" && renderMarketingTab()}
              {activeTab === "content" && renderContentTab()}
              {activeTab === "tickets" && renderTicketsTab()}
              {activeTab === "settings" && renderSettingsTab()}
              {activeTab === "roles" && renderRolesTab()}
            </div>
          </div>
        </div>

        {renderUserModal()}
        {renderPackModal()}
        {renderCampaignModal()}
        {renderPromoCodeModal()}
      </div>
    </ProtectedRoute>
  );
}
