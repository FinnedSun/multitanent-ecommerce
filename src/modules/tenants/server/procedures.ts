
import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const tenantsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        slug: z.string()
      })
    )
    .query(async ({ ctx, input }) => {

      const tenantsData = await ctx.db.find({
        collection: 'tenants',
        depth: 1, // "tenant.image" is type of "Media"
        where: {
          slug: {
            equals: input.slug
          },
        },
        limit: 1,
        pagination: false,
      })

      const tentant = tenantsData.docs[0];

      if (!tentant) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tenant not found'
        })
      }

      return tentant as Tenant & { image: Media | null };
    })
})