import type { AutobuySettings, Prisma, User } from '@prisma/client'
import { prisma } from './client'
import logger from '../../config/logger';

type UserWithAutobuySettings = Prisma.UserGetPayload<{include: {autobuySettings: true}}>;
class UserRepository {
  public async findById(chatId: number, autobuySettings: boolean = false): Promise<UserWithAutobuySettings | null> {
    try {
      return prisma.user.findUnique({
        where: { chatId },
        include: { autobuySettings }
      });
    } catch (error) {
      logger.error(`Error getting user from db: ${error}`);
      return null;
    }
  }

  public async checkUserExists(chatId: number | bigint) {
    try {
      const user = await prisma.user.findUnique({
        where: { chatId }
      });
      
      if (user) return true;
      return false;
    } catch (error) {
      logger.error(`Error checking user existence: ${error}`);
    }
  }

  public async create(data: Prisma.UserCreateInput): Promise<User | void> {
    try {
      const isUserExists = await this.checkUserExists(data.chatId);
      if (!isUserExists) {
        return prisma.user.create({
          data: {
            ...data,
            autobuySettings: {
              create: {}
            }
          }
        });
      }
    } catch (error) {
      logger.error(`Error creating user: ${error}`);
    }
  }

  public async topupBalance(chatId: number, amount: number): Promise<User | void> {
    try {
      await prisma.user.update({
        where: { chatId },
        data: {
          starBalance: { increment: amount }
        }
      });
    } catch (error) {
      logger.error(`Error while topup user balance: ${error}`);
    }
  }

  public async getBalance(chatId: number): Promise<number | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { chatId },
        select: { starBalance: true }
      });
      
      if (user) return user.starBalance;
    } catch (error) {
      logger.error("Error getting user balance: ", error);
    }

    return null;
  }

  public async decrementBalance(chatId: number, value: number): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { chatId },
        data: {
          starBalance: { decrement: value }
        }
      });

      return true;
    } catch (error) {
      logger.error("Error decrementing user balance: ", error);
      return false;
    }
  }

  public async getAutobuySettings(chatId: number): Promise<AutobuySettings | null> {
    const user = await this.findById(chatId, true);
    if (!user) return null;
    if (!user.autobuySettings) return null;

    return user.autobuySettings;
  }

  public async updateAutobuySettings(chatId: number, updatedFields: Partial<AutobuySettings>): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { chatId },
        include: { autobuySettings: true },
      });
      
      if (!user) return false;

      await prisma.autobuySettings.update({
        where: { userId: user.id },
        data: updatedFields
      });

      return true;
    } catch (error) {
      logger.error("Error updating autobuy settings: ", error);
    }
    return false;
  }
}

export const userRepository = new UserRepository();