import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.subscription.findMany();
  }

  async findOne(id: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return subscription;
  }

  async create(data: { name: string; monthlyPrice: number; quarterlyPrice: number; annualPrice: number; barberLimit: number; aiLimit: number }) {
    if (!data.name) {
      throw new BadRequestException('Plan name is required');
    }
    return this.prisma.subscription.create({
      data: {
        name: data.name,
        monthlyPrice: Number(data.monthlyPrice) || 0,
        quarterlyPrice: Number(data.quarterlyPrice) || 0,
        annualPrice: Number(data.annualPrice) || 0,
        barberLimit: Number(data.barberLimit) || 0,
        aiLimit: Number(data.aiLimit) || 0,
      },
    });
  }

  async update(id: string, data: any) {
    const { monthlyPrice, quarterlyPrice, annualPrice, barberLimit, aiLimit } = data;
    
    try {
      return await this.prisma.subscription.update({
        where: { id },
        data: {
          monthlyPrice: monthlyPrice !== undefined ? Number(monthlyPrice) : undefined,
          quarterlyPrice: quarterlyPrice !== undefined ? Number(quarterlyPrice) : undefined,
          annualPrice: annualPrice !== undefined ? Number(annualPrice) : undefined,
          barberLimit: barberLimit !== undefined ? Number(barberLimit) : undefined,
          aiLimit: aiLimit !== undefined ? Number(aiLimit) : undefined,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.subscription.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(`Cannot delete Subscription. It may be in use by active salons.`);
    }
  }

  // Initial seeder method (optional, for convenience)
  async seedPlans() {
    const defaultPlans = [
      { name: 'Free', monthlyPrice: 0.0, quarterlyPrice: 0.0, annualPrice: 0.0, barberLimit: 2, aiLimit: 20 },
      { name: 'Starter', monthlyPrice: 29.0, quarterlyPrice: 79.0, annualPrice: 290.0, barberLimit: 5, aiLimit: 100 },
      { name: 'Premium', monthlyPrice: 99.0, quarterlyPrice: 279.0, annualPrice: 990.0, barberLimit: 20, aiLimit: 1000 },
      { name: 'Enterprise', monthlyPrice: 299.0, quarterlyPrice: 849.0, annualPrice: 2990.0, barberLimit: 99999, aiLimit: 99999 },
    ];

    for (const plan of defaultPlans) {
      const existing = await this.prisma.subscription.findUnique({
        where: { name: plan.name },
      });
      if (!existing) {
        await this.prisma.subscription.create({
          data: plan,
        });
      }
    }
    
    return { message: 'Default plans seeded successfully' };
  }
}
