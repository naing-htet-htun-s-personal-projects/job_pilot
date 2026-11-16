import { NextResponse } from "next/server"
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer"
import { createInsforgeServer } from "@/lib/insforge-server"
import { generateResumeContent, type GeneratedResumeContent } from "@/lib/openai"
import { captureServerEvent } from "@/lib/posthog-server"
import type { Profile, ResumeGenerateResponse } from "@/types"

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#0F172A",
    lineHeight: 1.4,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    paddingBottom: 10,
    marginBottom: 14,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
  },
  title: {
    fontSize: 11,
    color: "#334155",
    marginTop: 2,
  },
  contactRow: {
    fontSize: 9,
    color: "#475569",
    marginTop: 4,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#1E293B",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 3,
    marginBottom: 6,
  },
  roleBlock: {
    marginBottom: 8,
  },
  roleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: "bold",
  },
  roleCompany: {
    fontSize: 10,
    color: "#334155",
    marginBottom: 2,
  },
  bullet: {
    marginLeft: 10,
    marginBottom: 2,
  },
  skillsText: {
    fontSize: 9.5,
    color: "#1E293B",
  },
})

function ResumeDocument({
  profile,
  content,
}: {
  profile: Profile
  content: GeneratedResumeContent
}) {
  const contactItems = [
    profile.email,
    profile.phone,
    profile.location,
    profile.linkedin_url,
    profile.portfolio_url,
  ].filter(Boolean)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{profile.full_name || "Candidate"}</Text>
          {profile.current_title ? (
            <Text style={styles.title}>{profile.current_title}</Text>
          ) : null}
          {contactItems.length > 0 ? (
            <Text style={styles.contactRow}>{contactItems.join("  |  ")}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text>{content.summary}</Text>
        </View>

        {profile.skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skillsText}>{profile.skills.join(" • ")}</Text>
          </View>
        ) : null}

        {content.experienceBullets.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {content.experienceBullets.map((role, idx) => (
              <View key={idx} style={styles.roleBlock}>
                <View style={styles.roleHeader}>
                  <Text>{role.title}</Text>
                  <Text>{role.period}</Text>
                </View>
                <Text style={styles.roleCompany}>{role.company}</Text>
                {role.bullets.map((bullet, bIdx) => (
                  <Text key={bIdx} style={styles.bullet}>
                    • {bullet}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {profile.education ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <Text>
              {profile.education.degree}
              {profile.education.field ? ` in ${profile.education.field}` : ""}
              {profile.education.institution ? ` — ${profile.education.institution}` : ""}
              {profile.education.year ? ` (${profile.education.year})` : ""}
            </Text>
          </View>
        ) : null}
      </Page>
    </Document>
  )
}

async function renderResumePdfBuffer(profile: Profile, content: GeneratedResumeContent) {
  return renderToBuffer(<ResumeDocument profile={profile} content={content} />)
}

export async function POST() {
  try {
    const insforge = await createInsforgeServer()
    const { data: authData, error: authError } = await insforge.auth.getCurrentUser()
    const user = authData?.user ?? null

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profileData, error: profileError } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError || !profileData) {
      return NextResponse.json(
        { error: "Profile not found. Please save your profile first." },
        { status: 404 }
      )
    }

    const profile = profileData as Profile
    const content = await generateResumeContent(profile)
    const pdfBuffer = await renderResumePdfBuffer(profile, content)

    const bucket = insforge.storage.from("resumes")
    const filePath = `${user.id}/resume.pdf`
    await bucket.remove(filePath).catch(() => {})

    const pdfFile = new File([new Uint8Array(pdfBuffer)], "resume.pdf", {
      type: "application/pdf",
    })
    const { data: storageData, error: uploadError } = await bucket.upload(filePath, pdfFile)

    if (uploadError || !storageData?.url) {
      return NextResponse.json(
        { error: uploadError?.message || "Failed to upload generated resume" },
        { status: 500 }
      )
    }

    const { error: updateError } = await insforge.database
      .from("profiles")
      .update({ resume_pdf_url: storageData.url })
      .eq("id", user.id)

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Failed to update profile resume URL" },
        { status: 500 }
      )
    }

    await captureServerEvent(user.id, "resume_generated", {
      source: content.source,
    })

    const response: ResumeGenerateResponse = {
      url: storageData.url,
      fileName: "resume.pdf",
      generatedAt: new Date().toISOString(),
      source: content.source,
    }

    return NextResponse.json(response)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate resume" },
      { status: 500 }
    )
  }
}
