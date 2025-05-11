import {
  pgTable,
  integer,
  boolean,
  text,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),

  // basic file/folder info
  name: text("name").notNull(),
  path: text("path").notNull(), // eg: /documents/project/notes.pdf
  size: integer("size").notNull(),
  type: text("type").notNull(), // mime type

  // storage information
  fileUrl: text("file_url").notNull(), // url to access the file

  // ownership info
  userId: text("user_id").notNull(), // user who uploaded the file
  parentId: uuid("parent_id"), // parent folder id (null for root folders)

  // file/folder flags
  isFolder: boolean("is_folder").notNull().default(false), // true if this is a folder
  isStarred: boolean("is_starred").notNull().default(false), // true if this file/folder is starred
  isTrash: boolean("is_trash").notNull().default(false), // true if this file/folder is in trash

  // timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// parent: each file/folder can have one parent folder
// children: each folder can have many files/folders
export const fileRelations = relations(files, ({ one, many }) => ({
  parent: one(files, {
    fields: [files.parentId],
    references: [files.id],
  }),

  // relationship to child file/folder
  children: many(files),
}));

// type definition for the file table
export type File = typeof files.$inferSelect;
export const newFile = typeof files.$inferInsert;
