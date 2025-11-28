"use server";

import { supabase } from "@/config/supabaseClient";
import { Buffer } from "node:buffer";

export type ApplyActionState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const RESUME_BUCKET = "resume";
const RESUME_FOLDER = "resumes";

export async function submitApplication(
  _prevState: ApplyActionState,
  formData: FormData
): Promise<ApplyActionState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const vacancyId = formData.get("vacancyId")?.toString().trim();
  const resumeFile = formData.get("resume") as File | null;

  if (!name || !email || !phone || !vacancyId) {
    return { status: "error", message: "შეავსე ყველა აუცილებელი ველი." };
  }

  if (!resumeFile || resumeFile.size === 0) {
    return { status: "error", message: "ატვირთე შენი PDF რეზიუმე." };
  }

  if (resumeFile.type !== "application/pdf") {
    return { status: "error", message: "სულ PDF ფაილი შეიძლება." };
  }

  if (resumeFile.size > MAX_FILE_SIZE) {
    return { status: "error", message: "ფაილი 10MB-ს უნდა ჩამოსცდეს." };
  }

  const safeName = resumeFile.name.replace(/\s+/g, "-").toLowerCase();
  const filePath = `${RESUME_FOLDER}/${vacancyId}-${Date.now()}-${safeName}`;

  try {
    const buffer = Buffer.from(await resumeFile.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from(RESUME_BUCKET)
      .upload(filePath, buffer, {
        contentType: resumeFile.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[submitApplication] upload error", uploadError.message);
      return {
        status: "error",
        message: "ფაილის ატვირთვისას პრობლემა შეგვექმნა.",
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(RESUME_BUCKET).getPublicUrl(filePath);

    const { error: insertError } = await supabase.from("apply").insert({
      name,
      email,
      phone,
      vacanyId: vacancyId,
      resume: publicUrl,
    });

    if (insertError) {
      console.error("[submitApplication] insert error", insertError.message);
      return {
        status: "error",
        message: "განაცხადის შენახვა ვერ მოხერხდა.",
      };
    }

    return {
      status: "success",
      message: "მადლობა განაცხადისთვის — მალე გამოგეხმაურებით.",
    };
  } catch (err) {
    console.error("[submitApplication] unexpected error", err);
    return {
      status: "error",
      message: "რაღაც გაუთვალისწინებელი მოხდა, სცადე მოგვიანებით.",
    };
  }
}


