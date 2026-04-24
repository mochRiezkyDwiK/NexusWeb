"use server";

import { db } from "@/db";
import { messages, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

async function assertAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  const email = session?.user?.email?.toLowerCase();
  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.toLowerCase();

  if (role === "admin") return;
  if (adminEmail && email === adminEmail) return;

  throw new Error("Akses ditolak. Hanya admin yang dapat melakukan aksi ini.");
}

export async function addProductAction(formData: FormData) {
  await assertAdmin();
  const nameRaw = formData.get("name");
  const priceRaw = formData.get("price");
  const descriptionRaw = formData.get("description");
  const sourceUrlRaw = formData.get("source_url");

  const name = typeof nameRaw === "string" ? nameRaw.trim() : "";
  const description = typeof descriptionRaw === "string" ? descriptionRaw.trim() : "";
  const sourceUrl = typeof sourceUrlRaw === "string" ? sourceUrlRaw.trim() : "";
  const price = typeof priceRaw === "string" ? Number(priceRaw) : Number.NaN;

  if (!name || !description || !Number.isFinite(price)) {
    throw new Error("Nama, harga, dan deskripsi wajib diisi dengan format yang benar");
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
    console.error("[addProductAction] Insert failed", {
      payload: {
        name,
        price,
        descriptionLength: description.length,
        sourceUrl: sourceUrl || null,
      },
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : null,
      error,
    });
    throw new Error("Gagal menambah produk. Silakan coba lagi.");
  }
}

export async function updateProductAction(id: number, formData: FormData) {
  await assertAdmin();
  const nameRaw = formData.get("name");
  const priceRaw = formData.get("price");
  const descriptionRaw = formData.get("description");
  const sourceUrlRaw = formData.get("source_url");

  const name = typeof nameRaw === "string" ? nameRaw.trim() : "";
  const description = typeof descriptionRaw === "string" ? descriptionRaw.trim() : "";
  const sourceUrl = typeof sourceUrlRaw === "string" ? sourceUrlRaw.trim() : "";
  const price = typeof priceRaw === "string" ? Number(priceRaw) : Number.NaN;

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("ID produk tidak valid");
  }

  if (!name || !description || !Number.isFinite(price)) {
    throw new Error("Nama, harga, dan deskripsi wajib diisi dengan format yang benar");
  }

  try {
    await db
      .update(products)
      .set({
        name,
        price,
        description,
        sourceUrl: sourceUrl || null,
      })
      .where(eq(products.id, id));

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[updateProductAction] Update failed", {
      id,
      payload: {
        name,
        price,
        descriptionLength: description.length,
        sourceUrl: sourceUrl || null,
      },
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : null,
      error,
    });
    throw new Error("Gagal mengubah produk. Silakan coba lagi.");
  }
}

export async function deleteProductAction(id: number) {
  await assertAdmin();
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("ID produk tidak valid");
  }

  try {
    await db.delete(products).where(eq(products.id, id));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[deleteProductAction] Delete failed", {
      id,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : null,
      error,
    });
    throw new Error("Gagal menghapus produk. Silakan coba lagi.");
  }
}

type ContactMessageActionState = {
  success: boolean;
  message: string | null;
};

export async function saveContactMessage(
  prevStateOrFormData: ContactMessageActionState | FormData,
  maybeFormData?: FormData,
): Promise<ContactMessageActionState> {
  const formData = prevStateOrFormData instanceof FormData ? prevStateOrFormData : maybeFormData;

  if (!formData) {
    return { success: false, message: "Form data tidak ditemukan" };
  }

  const nameRaw = formData.get("name");
  const emailRaw = formData.get("email");
  const subjectRaw = formData.get("subject");
  const messageRaw = formData.get("message");

  const name = typeof nameRaw === "string" ? nameRaw.trim() : "";
  const email = typeof emailRaw === "string" ? emailRaw.trim() : "";
  const subject = typeof subjectRaw === "string" ? subjectRaw.trim() : "";
  const message = typeof messageRaw === "string" ? messageRaw.trim() : "";

  if (!name || !email || !subject || !message) {
    return { success: false, message: "Semua field wajib diisi" };
  }

  try {
    await db.insert(messages).values({
      name,
      email,
      subject,
      message,
    });

    revalidatePath("/");
    return { success: true, message: "Pesan berhasil dikirim" };
  } catch (error) {
    console.error("[saveContactMessage] Insert failed", {
      payload: {
        name,
        email,
        subjectLength: subject.length,
        messageLength: message.length,
      },
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : null,
      error,
    });
    return { success: false, message: "Gagal menyimpan pesan. Silakan coba lagi." };
  }
}
