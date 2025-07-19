import { Prisma } from "@prisma/client";
import { prisma } from "./client";
import logger from "../../config/logger";

class InvoiceRepository {
  public async createInvoice(data: Prisma.InvoiceCreateInput) {
    try {
      return await prisma.invoice.create({ data });
    } catch (error) {
      logger.error("Error creating invoice: ", error);
    }
  }

  public async findById(invoiceId: string) {
    try {
      return await prisma.invoice.findUnique({
        where: { id: invoiceId }
      });
    } catch (error) {
      logger.error("Error getting invoice by id: ", error);
    }
  }

  public async updateInvoiceStatusSuccess(invoiceId: string, paymentId: string) {
    try {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          isPaid: true,
          paidAt: new Date(),
          paymentId
        }
      });
    } catch (error) {
      logger.error("Error updating invoice status: ", error);
    }
  }
}

export const invoiceRepository = new InvoiceRepository();