import type { Prisma, User } from '@prisma/client'
import { prisma } from './client'
import logger from '../../config/logger';

class UserRepository {
  public async findById(chatId: number): Promise<User | null> {
    try {
      return prisma.user.findUnique({
        where: { chatId }
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
          data
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
}

export const userRepository = new UserRepository();