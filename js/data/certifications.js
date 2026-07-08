/* ============================================================
   CERTIFICATIONS DATA
   ------------------------------------------------------------
   HOW TO ADD A NEW CERTIFICATION:
   1. Copy one object below (the { ... } block).
   2. Paste it into the CERTIFICATIONS array.
   3. Update the fields. That's it — no layout/HTML changes needed.

   status: "completed" | "in-progress" | "planned"
   ============================================================ */

const CERTIFICATIONS = [
  {
        id: "security-plus",
        name: "CompTIA Security+",
        issuer: "CompTIA",
        logo: "S+",
        accent: "blue",
        status: "completed",
        issueDate: "Add issue date",
        credentialId: "Add credential ID",
        verifyUrl: "#",
        isPlaceholderDetails: true,
        skills: ["Threat Management", "Cryptography", "Identity Management", "Risk Mitigation", "Network Security"]
  },
  {
        id: "cysa-plus",
        name: "CompTIA CySA+",
        issuer: "CompTIA",
        logo: "CySA+",
        accent: "cyan",
        status: "completed",
        issueDate: "Add issue date",
        credentialId: "Add credential ID",
        verifyUrl: "#",
        isPlaceholderDetails: true,
        skills: ["Threat Detection", "Security Analytics", "Incident Response", "Vulnerability Management", "SOC Operations"]
  },
  {
        id: "sc-200",
        name: "Microsoft Certified: Security Operations Analyst Associate",
        shortName: "SC-200",
        issuer: "Microsoft",
        logo: "SC-200",
        accent: "indigo",
        status: "completed",
        issueDate: "Add issue date",
        credentialId: "Add credential ID",
        verifyUrl: "#",
        isPlaceholderDetails: true,
        skills: ["Microsoft Sentinel", "Microsoft Defender", "KQL", "Threat Hunting", "SOC Analysis"]
  },
  {
        id: "aws-saa",
        name: "AWS Certified Solutions Architect \u2013 Associate",
        shortName: "AWS SAA-C03",
        issuer: "Amazon Web Services",
        logo: "AWS",
        accent: "orange",
        status: "completed",
        issueDate: "Add issue date",
        credentialId: "Add credential ID",
        verifyUrl: "#",
        isPlaceholderDetails: true,
        skills: ["AWS Architecture", "IAM", "VPC Networking", "Cost Optimization", "High Availability"]
  },
  {
        id: "aws-security-specialty",
        name: "AWS Certified Security \u2013 Specialty",
        shortName: "AWS Security Specialty",
        issuer: "Amazon Web Services",
        logo: "AWS",
        accent: "orange",
        status: "in-progress",
        issueDate: "In progress",
        credentialId: "Not yet issued",
        verifyUrl: "#",
        isPlaceholderDetails: true,
        skills: ["GuardDuty", "Security Hub", "KMS", "IAM Policy Design", "Incident Response on AWS"]
  },
  {
        id: "ccsk",
        name: "Certificate of Cloud Security Knowledge (CCSK)",
        shortName: "CCSK",
        issuer: "Cloud Security Alliance",
        logo: "CCSK",
        accent: "teal",
        status: "planned",
        issueDate: "Planned",
        credentialId: "Not yet issued",
        verifyUrl: "#",
        isPlaceholderDetails: true,
        skills: ["Cloud Governance", "Cloud Risk Management", "Shared Responsibility Model", "Cloud Architecture Security"]
  }
  ];
