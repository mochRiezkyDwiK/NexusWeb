"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function addProductAction(formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseInt(formData.get("price") as string);
  const description = formData.get("description") as string;
  const sourceUrl = formData.get("source_url") as string;

  if (!name || !price || !description) {
    throw new Error("Nama, harga, dan deskripsi wajib diisi");
  }

  try {
    await db.insert(products).values({
      name,
      price,
      description,
      sourceUrl: sourceUrl || null,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Gagal menambah produk. Silakan coba lagi.");
  }
}
