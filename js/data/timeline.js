/* ============================================================
   JOURNEY / TIMELINE DATA
   ------------------------------------------------------------
   HOW TO ADD A NEW MILESTONE:
   1. Copy one object below.
   2. Add it to the TIMELINE array in the order it happened.
   3. Set "type" to control the icon + color:
      "education" | "cert" | "project" | "future"
   ============================================================ */

const TIMELINE = [
  {
        id: "start-cyber",
        type: "education",
        date: "Add date",
        title: "Started Studying Cybersecurity",
        description: "Began the Cybersecurity program at Florida International University (FIU), building a foundation in networking, systems, and security fundamentals.",
        isPlaceholderDate: true
  },
  {
        id: "security-plus",
        type: "cert",
        date: "Add date",
        title: "CompTIA Security+",
        description: "Earned CompTIA Security+, validating core security principles: risk management, cryptography, identity, and network security.",
        isPlaceholderDate: true
  },
  {
        id: "cysa-plus",
        type: "cert",
        date: "Add date",
        title: "CompTIA CySA+",
        description: "Earned CompTIA CySA+, focused on threat detection, security analytics, and incident response from a SOC analyst perspective.",
        isPlaceholderDate: true
  },
  {
        id: "sc-200",
        type: "cert",
        date: "Add date",
        title: "Microsoft SC-200",
        description: "Earned the Microsoft Certified: Security Operations Analyst Associate certification, covering Microsoft Sentinel, Defender, and KQL-based threat hunting.",
        isPlaceholderDate: true
  },
  {
        id: "aws-saa",
        type: "cert",
        date: "Add date",
        title: "AWS Solutions Architect \u2013 Associate",
        description: "Earned AWS Certified Solutions Architect \u2013 Associate, developing a strong foundation in AWS architecture, IAM, networking, and cost-aware design.",
        isPlaceholderDate: true
  },
  {
        id: "aws-security-project",
        type: "project",
        date: "In Progress",
        title: "AWS Enterprise Security Monitoring Platform",
        description: "Building a hands-on enterprise-style AWS security monitoring platform using Terraform \u2014 IAM, CloudTrail, GuardDuty, Security Hub, AWS Config, CloudWatch, and SNS.",
        isPlaceholderDate: false
  },
  {
        id: "aws-security-specialty",
        type: "cert",
        date: "In Progress",
        title: "AWS Security \u2013 Specialty (In Progress)",
        description: "Currently studying for AWS Certified Security \u2013 Specialty to deepen expertise in cloud-native detection, encryption, and incident response.",
        isPlaceholderDate: false
  },
  {
        id: "ccsk",
        type: "cert",
        date: "Planned",
        title: "CCSK (Planned)",
        description: "Planning to pursue the Certificate of Cloud Security Knowledge (CCSK) to strengthen vendor-neutral cloud security governance knowledge.",
        isPlaceholderDate: false
  },
  {
        id: "future-cse",
        type: "future",
        date: "The Road Ahead",
        title: "Future Cloud Security Engineer",
        description: "Working toward a full-time role as a Cloud Security Engineer, Security Engineer, or SOC Analyst \u2014 applying hands-on cloud security skills at enterprise scale.",
        isPlaceholderDate: false
  }
  ];
