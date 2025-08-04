import { DepositoExport, PagoExport } from '../types/exportTypes';

type ExportTransformer = (data: any[]) => any[];

const exportModels: Record<string, ExportTransformer> = {
  depositos: (data): DepositoExport[] =>
    data.map(t => ({
      id: t.id,
      settlement_report_id: t.settlement_report_id,
      disbursement_date: t.disbursement_date,
      gross_amount: t.gross_amount,
      totalFee: t.totalFee,
      totalTax: t.totalTax,
      totalRetention: t.totalRetention,
      disbursedNetAmount: t.disbursedNetAmount,
      totalTransactions: t.totalTransactions,
      linkHref: t.linkHref,
      payments: t.payments
    })), 

  transacciones: (data): PagoExport[] =>
    data.map(p => ({
      ID: p.id,
      Recibo: p.receiptNo,
      Fecha: new Date(p.createdAt).toISOString().split("T").join(" ").slice(0, 19),
      Correo: p.userEmail,
      Estado: p.status,
      Método: p.paymentMethod,
      SubTipo: p.subType,
      Marca: p.card.brand,
      Banco: p.card.issuer,
      Últimos4: `**** ${p.card.last4}`,
      Moneda: p.currency,
      Monto: p.amount,
      Propina: p.tip,
      Total: p.total
    }))
};

export function getExportModel(seccion: string): ExportTransformer {
  return exportModels[seccion] || ((data) => data);
}
