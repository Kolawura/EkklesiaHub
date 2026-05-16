import { prisma } from "../db/prisma";

export const createTag = async (name: string) => {
  return await prisma.tag.create({
    data: { name },
  });
};

export const getAllTags = async () => {
  return await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });
};

export const getTagByName = async (name: string) => {
  return await prisma.tag.findUnique({
    where: { name },
  });
};
