import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { generateInvoice, CompanyInfo, InvoicePayment } from "@/lib/invoiceGenerator";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("bookings").select("*, packages(name, type, duration_days), profiles(full_name, phone, passport_number, address)").order("created_at", { ascending: false })
      .then(({ data }) => setBookings(data || []));
  }, []);

  const handleDownloadInvoice = async (b: any) => {
    setGeneratingId(b.id);
    try {
      const { data: payments } = await supabase
        .from("payments")
        .select("*")
        .eq("booking_id", b.id)
        .order("installment_number", { ascending: true });

      const { data: cms } = await supabase
        .from("site_content" as any)
        .select("content")
        .eq("section_key", "contact")
        .maybeSingle();

      const cmsContent = (cms as any)?.content || {};
      const company: CompanyInfo = {
        name: "RAHE KABA",
        phone: cmsContent.phone || "",
        email: cmsContent.email || "",
        address: cmsContent.location || "",
      };

      await generateInvoice(
        { ...b, packages: b.packages },
        b.profiles || {},
        (payments || []) as InvoicePayment[],
        company
      );
      toast.success("Invoice downloaded");
    } catch (err: any) {
      toast.error("Failed to generate invoice");
    }
    setGeneratingId(null);
  };

  return (
    <div className="space-y-3">
      <h2 className="font-heading text-xl font-bold">All Bookings</h2>
      {bookings.map((b: any) => (
        <div key={b.id} className="bg-card border border-border rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-mono font-bold text-primary text-sm">{b.tracking_id}</p>
              <p className="text-sm text-muted-foreground">{b.profiles?.full_name || "Unknown"} • {b.packages?.name || "N/A"}</p>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${b.status === "completed" ? "text-emerald bg-emerald/10" : b.status === "cancelled" ? "text-destructive bg-destructive/10" : b.status === "ticket_issued" ? "text-emerald bg-emerald/10" : "text-primary bg-primary/10"}`}>
              {b.status}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div><p className="text-muted-foreground">Total</p><p className="font-medium">৳{Number(b.total_amount).toLocaleString()}</p></div>
            <div><p className="text-muted-foreground">Paid</p><p className="font-medium">৳{Number(b.paid_amount).toLocaleString()}</p></div>
            <div><p className="text-muted-foreground">Due</p><p className="font-medium text-destructive">৳{Number(b.due_amount || 0).toLocaleString()}</p></div>
          </div>
          <div className="mt-3 pt-3 border-t border-border/50">
            <button
              onClick={() => handleDownloadInvoice(b)}
              disabled={generatingId === b.id}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              {generatingId === b.id ? "Generating..." : "Download Invoice"}
            </button>
          </div>
        </div>
      ))}
      {bookings.length === 0 && <p className="text-center text-muted-foreground py-12">No bookings yet.</p>}
    </div>
  );
}
