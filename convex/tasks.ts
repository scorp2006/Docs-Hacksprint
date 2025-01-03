import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    const query = args.projectId
      ? ctx.db
          .query("tasks")
          .filter((q) => q.eq(q.field("projectId"), args.projectId))
      : ctx.db.query("tasks");

    return await query.collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    priority: v.string(),
    dueDate: v.optional(v.number()),
    projectId: v.id("projects"),
    assignedTo: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const taskId = await ctx.db.insert("tasks", {
      ...args,
      createdBy: identity.subject,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return taskId;
  },
});
